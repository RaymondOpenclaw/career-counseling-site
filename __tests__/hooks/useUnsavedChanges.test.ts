import { renderHook } from '@testing-library/react';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

describe('useUnsavedChanges', () => {
  const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

  beforeEach(() => {
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
  });

  afterAll(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('does not add beforeunload listener when not dirty', () => {
    renderHook(() => useUnsavedChanges(false));
    const beforeUnloadCalls = addEventListenerSpy.mock.calls.filter(
      ([type]) => type === 'beforeunload'
    );
    expect(beforeUnloadCalls).toHaveLength(0);
  });

  it('adds beforeunload listener when dirty', () => {
    renderHook(() => useUnsavedChanges(true));
    const beforeUnloadCalls = addEventListenerSpy.mock.calls.filter(
      ([type]) => type === 'beforeunload'
    );
    expect(beforeUnloadCalls).toHaveLength(1);
  });

  it('removes beforeunload listener on unmount', () => {
    const { unmount } = renderHook(() => useUnsavedChanges(true));
    unmount();
    const removeCalls = removeEventListenerSpy.mock.calls.filter(
      ([type]) => type === 'beforeunload'
    );
    expect(removeCalls).toHaveLength(1);
  });

  it('calls preventDefault on beforeunload when dirty', () => {
    renderHook(() => useUnsavedChanges(true));
    const beforeUnloadCalls = addEventListenerSpy.mock.calls.filter(
      ([type]) => type === 'beforeunload'
    );
    expect(beforeUnloadCalls).toHaveLength(1);

    const handler = beforeUnloadCalls[0][1] as EventListener;
    const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
    Object.defineProperty(event, 'returnValue', { writable: true, value: '' });
    handler(event);
    expect(event.returnValue).toBe('');
  });
});
