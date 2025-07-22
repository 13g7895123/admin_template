### 專案說明

## 功能需求
1. 這是一個後台的範例模板，需包含RWD、亮暗模式
2. 有一個左側的sidebar，需要可以收折
    1. 最上方為專案名稱的文字或是圖片
    2. 中間為各項item包含icon + text
        1. item為兩層(一層為group，底下有各自的item)
        2. item需有滑入的動畫
        3. 一般模式下為icon在左，text在右
        4. 收折的時候，改為僅顯示icon，hover會顯示text
        5. 手機版改為併入Navbar的漢堡選單
        6. item的層級可以由設定中變更
        7. 預設會有Dashboards、Setting、Help Center三個項目
    3. 最下方為登出按鈕
3. 右側上方有一個Navbar，手機版會改成漢堡選單
    1. 最右側從右邊數來依序為頭像、小鈴鐺(通知)、亮暗模式的切換按鈕、語系的地球icon、搜尋的放大鏡icon
        1. 每一個按鈕點進去會出現對應的內容
4. 在Navbar下方是麵包屑，顯示當前的頁面路徑
    1. 最左側為當前的頁面項目，對標sidebar的顯示項目
    2. 在1的右側有一個直線分隔，後面的部分為Home往後的路徑，例如: Home > Dashboards
5. 麵包屑的下方為主要的顯示區域，請確保不要被sidebar與navbar切到
6. 主要顯示區域的下方有一塊小塊的Footbar，可以由設定中決定是否要顯示

## 架構
1. 本專案用Nuxt完成
2. 請幫我串接git網址為"https://github.com/13g7895123/admin_template.git"

## 設計需求
1. 希望可以在設定中設定主色調
2. 希望可以是乾淨整潔的頁面，並且可以多用圓角讓使用上不這麼銳利
3. 設計上可以參考這個網址的風格，"https://demos.pixinvent.com/vuexy-html-admin-template/html/vertical-menu-template/"

