// Кликаем, если находим на "Спасибо" и "Скачать раздачу"
function getElementByXpath(path) {
    console.log("getElementByXpath.path: " +  path);
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function download_and_thank() {
    console.log("download_and_thank start.");

    //var download_tag = document.querySelector("a.genmed");
    var download_tag = getElementByXpath( '//a[@class="genmed"]' );
    console.log("download_tag: " +  download_tag);

    if (download_tag == null) {
        download_tag = getElementByXpath( '//a[@class="seedmed"]' );
        console.log("download_tag: " +  download_tag);
    }

    if (download_tag == null) {
        return;
    }

    var href = download_tag.href
    console.log("url download: " +  href);

    var id_torrent = href.split('id=')[1]
    console.log("id_torrent: " +  id_torrent);

    var thank_tag = getElementByXpath('//span[@id="VB' + id_torrent + '"]/img');
    console.log("thank_tag: " +  thank_tag);

    if (thank_tag == null) {
        return;
    }

    // Благодарим за раздачу
    console.log("thank_tag.click()");
    thank_tag.click()

    // Кликаем на скачивание
    console.log("download_tag.click()");
    download_tag.click()

    console.log("download_and_thank finish.");
}

download_and_thank()
