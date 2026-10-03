const DriveService = {
  saveMemorySubmission: function(data) {
    const rootFolder = DriveApp.getFolderById(data.driveFolderId);
    
    const categoryName = data.relationship || 'Other';
    let categoryFolder;
    const catFolders = rootFolder.getFoldersByName(categoryName);
    categoryFolder = catFolders.hasNext() ? catFolders.next() : rootFolder.createFolder(categoryName);

    const timestamp = Utilities.formatDate(new Date(), "GMT+2", "yyyyMMdd_HHmmss");
    const sanitizedName = data.name.replace(/[^a-zA-Z0-9]/g, "_");
    const folderName = `${timestamp}_${sanitizedName}`;
    const submissionFolder = categoryFolder.createFolder(folderName);

    submissionFolder.createFile("message.txt", data.message || "");
    submissionFolder.createFile("metadata.json", JSON.stringify(data, null, 2));

    if (data.mediaFiles && data.mediaFiles.length > 0) {
      data.mediaFiles.forEach((file) => {
        const decoded = Utilities.base64Decode(file.base64);
        const blob = Utilities.newBlob(decoded, file.type, file.name);
        submissionFolder.createFile(blob);
      });
    }

    return submissionFolder.getUrl();
  }
};