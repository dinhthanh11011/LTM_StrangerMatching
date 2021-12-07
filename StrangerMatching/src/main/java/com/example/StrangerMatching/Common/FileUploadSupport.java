package com.example.StrangerMatching.Common;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class FileUploadSupport {
    public static final String UPLOAD_FOLDER_NAME = "/uploads/";
    public static final String UPLOAD_FOLDER_PATH = "StrangerMatching/src/main/resources/static" + UPLOAD_FOLDER_NAME;

    public static File uploadOne(MultipartFile file) {
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("ddMMyyyyHHmmss");
            File convFile = new File(UPLOAD_FOLDER_PATH + formatter.format(new Date()) + new Random().nextInt() + FunctionSupport.removeVietNameseTone(file.getOriginalFilename()).replaceAll("\\s",""));
            convFile.createNewFile();
            FileOutputStream fileOutputStream = new FileOutputStream(convFile);
            fileOutputStream.write(file.getBytes());
            fileOutputStream.close();
            return convFile;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static boolean deleteOneByName(String name) {
        try {
            Files.delete(Paths.get(UPLOAD_FOLDER_PATH + name));
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
