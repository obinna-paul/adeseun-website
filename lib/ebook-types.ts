export type BookFormat = "paperback" | "ebook";

export type EbookPublicationStatus = "uploading" | "processing" | "published" | "failed";

export type EbookPublication = {
  bookId: string;
  priceNaira: number;
  status: EbookPublicationStatus;
  originalFilename: string;
  sourceKey: string;
  sourceBytes: number;
  uploadId?: string;
  manifestKey?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  error?: string;
  processingStage?: string;
  processingProgress?: number;
  processedPages?: number;
  pageCount?: number;
  processingStartedAt?: string;
};

export type EbookCatalogItem = {
  bookId: string;
  priceNaira: number;
  status: "published";
};

export type EbookManifest = {
  version: 1;
  bookId: string;
  pageCount: number;
  pageFormat: "webp";
  pageKeyPattern: string;
  generatedAt: string;
};

export type EbookEntitlement = {
  bookId: string;
  customerEmail: string;
  customerName: string;
  orderReference: string;
  grantedAt: string;
};

export type ReadingProgress = {
  bookId: string;
  page: number;
  updatedAt: string;
};

export type ReaderAccessGrant = {
  email: string;
  name?: string;
  nextPath: string;
};
