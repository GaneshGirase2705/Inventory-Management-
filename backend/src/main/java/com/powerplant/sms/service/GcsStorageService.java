package com.powerplant.sms.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class GcsStorageService {

    @Value("${app.gcs.bucket-name:sms-powerplant-assets}")
    private String bucketName;

    @Value("${app.gcs.enabled:false}")
    private boolean gcsEnabled;

    /**
     * Uploads bytes (e.g. QR code PNG, Challan PDF/JPEG) to Google Cloud Storage.
     * Falls back to a local storage directory if running in local development mode without GCP credentials.
     */
    public String uploadFile(String objectPath, byte[] data, String contentType) throws IOException {
        if (gcsEnabled) {
            try {
                Storage storage = StorageOptions.getDefaultInstance().getService();
                BlobId blobId = BlobId.of(bucketName, objectPath);
                BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                        .setContentType(contentType)
                        .build();
                storage.create(blobInfo, data);
                return String.format("https://storage.googleapis.com/%s/%s", bucketName, objectPath);
            } catch (Exception e) {
                // Fallback to local on GCP connection issues
            }
        }

        // Local development storage fallback
        Path localDir = Paths.get(System.getProperty("user.home"), ".sms-powerplant-assets");
        if (!Files.exists(localDir)) {
            Files.createDirectories(localDir);
        }
        Path targetPath = localDir.resolve(objectPath.replace("/", "_"));
        Files.write(targetPath, data);
        return "/api/v1/assets/" + targetPath.getFileName().toString();
    }
}
