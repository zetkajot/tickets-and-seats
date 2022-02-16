export default interface Gateway {
  open(...args: any[]): Promise<void>;
  close(): Promise<void>;
}
