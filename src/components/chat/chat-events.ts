export const STOP_EVENT = 'lexiva:stop';

/** Asks the chat store to abort the reply that is currently streaming. */
export const requestStop = () => window.dispatchEvent(new Event(STOP_EVENT));