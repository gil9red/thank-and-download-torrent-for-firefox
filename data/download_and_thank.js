var DEBUG = false;


// Кликаем, если находим на "Спасибо" и "Скачать раздачу"
function getElementByXpath(path) {
    DEBUG && console.log("getElementByXpath.path: " +  path);
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function download_and_thank() {
    DEBUG && console.log("download_and_thank start.");

    //var download_tag = document.querySelector("a.genmed");
    var download_tag = getElementByXpath( '//a[@class="genmed"]' );
    DEBUG && console.log("download_tag: " +  download_tag);

    if (download_tag == null) {
        download_tag = getElementByXpath( '//a[@class="seedmed"]' );
        DEBUG && console.log("download_tag: " +  download_tag);
    }

    if (download_tag == null) {
        return;
    }

    var href = download_tag.href
    DEBUG && console.log("url download: " +  href);

    var id_torrent = href.split('id=')[1]
    DEBUG && console.log("id_torrent: " +  id_torrent);

    var thank_tag = getElementByXpath('//span[@id="VB' + id_torrent + '"]/img');
    DEBUG && console.log("thank_tag: " +  thank_tag);

    if (thank_tag == null) {
        return;
    }

    // Благодарим за раздачу
    DEBUG && console.log("thank_tag.click()");
    thank_tag.click()

    // Кликаем на скачивание
    DEBUG && console.log("download_tag.click()");
    download_tag.click()

    DEBUG && console.log("download_and_thank finish.");
}

download_and_thank()
