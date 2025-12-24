declare module 'react-native-receive-sharing-intent' {
  export interface SharedFile {
    contentUri: string;
    filePath: string | null;
    fileName: string | null;
    text: string | null;
    weblink: string | null;
    mimeType: string;
    subject: string | null;
  }

  export type ReceiveCallback = (files: SharedFile[]) => void;
  export type ErrorCallback = (error: string) => void;

  export default class ReceiveSharingIntent {
    static getReceivedFiles(
      callback: ReceiveCallback,
      errorCallback: ErrorCallback,
      protocol?: string
    ): void;

    static clearReceivedFiles(): void;
  }
}
