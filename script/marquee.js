document.addEventListener("MenuItemsLoaded", (event) => {
    console.log(event.detail.message)
    let mTrack = document.getElementById("marquee-track");

    let numDuplicates = 2;

    let cards = mTrack.children;

    let length = cards.length;
    for(let dup = 0; dup < numDuplicates; dup++)
    {
        for(let i = 0; i < length; i++)
        {
            let duplicateCard = cards[i].cloneNode(true);
            mTrack.appendChild(duplicateCard);
        }
    }
})