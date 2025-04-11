package com.shop.shop.util;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil {

  @Value("${com.korea.upload.path}")
  private String uploadPath;

  @PostConstruct
  public void init() {
    File tempFolder = new File(uploadPath);

    if(tempFolder.exists() == false) {
      tempFolder.mkdir();
    }

    uploadPath = tempFolder.getAbsolutePath();

    log.info("-------------------------------------");
    log.info("업로드 패스: " + uploadPath);
  }

  public List<String> saveFiles(List<MultipartFile> files) throws RuntimeException{

    if(files == null || files.size() == 0){
      log.info("요청받은 파일이 없거나 파일의 크키가 0입니다.");
      return null; 
    }

    List<String> uploadNames = new ArrayList<>();

    for (MultipartFile multipartFile : files) {
        log.info("files: " + files);
      String savedName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
      
      Path savePath = Paths.get(uploadPath, savedName);

      try {
        Files.copy(multipartFile.getInputStream(), savePath);

        String contentType = multipartFile.getContentType();

        if(contentType != null && contentType.startsWith("image")){ //이미지여부 확인

          Path thumbnailPath = Paths.get(uploadPath, "s_" + savedName);

          Thumbnails.of(savePath.toFile())
                  .size(400,400)
                  .toFile(thumbnailPath.toFile());
        }
        log.info("---업로드네임---");
        uploadNames.add(savedName);
      } catch (IOException e) {
        log.error("파일 저장 과정에서 오류 발생");
        throw new RuntimeException(e.getMessage());
      }
    }//end for

    return uploadNames;
  }

  public ResponseEntity<Resource> getFile(String fileName) {
    
    Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);

    if(!resource.exists()) {

      resource = new FileSystemResource(uploadPath + File.separator + "default.jpg");
    
    }

    HttpHeaders headers = new HttpHeaders();

    try{
        headers.add("Content-Type", Files.probeContentType( resource.getFile().toPath() ));
    } catch(Exception e){
        return ResponseEntity.internalServerError().build();
    }
    return ResponseEntity.ok().headers(headers).body(resource);
  }


  public void deleteFiles(List<String> fileNames) {

    if(fileNames == null || fileNames.size() == 0){
      return;
    }

    fileNames.forEach(fileName -> {

      //썸네일이 있는지 확인하고 삭제 
      String thumbnailFileName = "s_" + fileName;
      Path thumbnailPath = Paths.get(uploadPath, thumbnailFileName);
      Path filePath = Paths.get(uploadPath, fileName);

      try {
        log.info("1filePath: " + filePath);
        Files.deleteIfExists(filePath);
        Files.deleteIfExists(thumbnailPath);
      } catch (IOException e) {
        throw new RuntimeException(e.getMessage());
      }
    });
  }



}
