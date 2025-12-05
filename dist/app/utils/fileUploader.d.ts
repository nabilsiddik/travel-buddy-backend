import multer from 'multer';
export declare const fileUploader: {
    upload: multer.Multer;
    uploadToCloudinary: (file: Express.Multer.File) => Promise<void | import("cloudinary").UploadApiResponse>;
};
//# sourceMappingURL=fileUploader.d.ts.map