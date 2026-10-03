# Lina & Moustafa — Digital Wedding Guest Book

## Overview
A modern, luxury digital guest book website designed for mobile-first wedding experiences. Features photo/video uploads, live audio/video recording, bilingual support (English/Arabic RTL), an interactive Guest Wall, and Google Workspace integration (Drive & Sheets).

---

## 1. Google Drive & Sheets Setup

1. **Google Drive Folder**:
   - Create a main folder named `Wedding Guest Book`.
   - Copy its **Folder ID** from the URL (`https://drive.google.com/drive/folders/YOUR_FOLDER_ID`).

2. **Google Sheet**:
   - Create a new Google Sheet.
   - Set up the following Header row in Row 1:
     `Date | Name | Phone | Relationship | Message | Drive Folder Link | Approval Status`
   - Copy its **Sheet ID** from the URL (`https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`).

---

## 2. Google Apps Script Deployment

1. Open [script.google.com](https://script.google.com) and create a new project.
2. Add files corresponding to `Code.gs`, `DriveService.gs`, `SheetService.gs`, `GuestWallService.gs`, and `AuthService.gs`.
3. Click **Deploy > New Deployment**.
4. Select Type: **Web app**.
5. Set **Execute as**: `Me`.
6. Set **Who has access**: `Anyone`.
7. Copy the generated **Web App URL**.

---

## 3. Web App Configuration & Deployment

1. Host the repository on **GitHub Pages** or any static web hosting provider.
2. Access `admin.html`.
3. Default Password: `LINA_SASA`
4. Enter your **Google Apps Script URL**, **Google Drive Folder ID**, and **Google Sheet ID**.
5. Click **Save Configuration**.
