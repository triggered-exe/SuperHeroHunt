(function () {
    const PUBLIC_KEY = "17276195778173eaec5692353710b8aa";
    const PRIVATE_KEY = "41364c67101cfb1e1f3cb5f109b5e4a41c22d73f";
    const TIMESTAMP = 1;
    const HASH = "2dee9fdb14009b460952ba66887aa4f2";
    //Event for searching a hero
    let search_hero = document.getElementById("search-box");
    search_hero.addEventListener("keyup", loadHeroes);
    
    // Event for Home Button
    const fav = document.getElementById("fav");
    console.log(fav)
    fav.addEventListener("click", loadFavourite);
    // Event for Favourite Button
    const home = document.getElementById("home");
    home.addEventListener("click", loadHeroes);
    
    let html = document.getElementById("main");
    
    // function to load heroes on screen on seraching
    async function loadHeroes() {
    
        let textSearched = document.getElementById("search-box").value;
        //check whether text is valid string
        if (textSearched === "" || !isNaN(textSearched)) {
            html.innerHTML = `<p style="color:#6400ff;background-color: rgb(118 116 121 / 56%); margin-left:30%;margin-top:10%;font-weight: 100px;
            font-size:5vw;">
            Enter a Proper Name
          </p>`;
            return;
        }
        //connecting with the api
        //keys and hashes are declares in config.js
        const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${textSearched}&apikey=${PUBLIC_KEY}&hash=${HASH}?ts=${TIMESTAMP}`
        let response = await fetch(url);
        let data = await response.json();
        let hero_data = data.data.results;
        if (hero_data.length === 0 || hero_data === undefined) return;
        // appending the received the data from api to screen
        let ul = document.createElement("ul")
        hero_data.forEach(hero => {
            let isFavourite = "";
            if (localStorage.getItem(hero.id) != undefined) {
                isFavourite = "checked";
            }
    
            ul.innerHTML += ` 
            <li>
            <div>
            <div id="more-info${hero.id}" data-id="${hero.id}">
            <img src="${hero.thumbnail.path + '/portrait_medium.' + hero.thumbnail.extension}" alt="">
    
                   <span class="hero-name">${hero.name}</span>
    
              </div>
    
            <div class="hero_info" id="hero_id_${hero.id}"> 
            <span class="id">Id : ${hero.id}</span>
            <span class="comics">Comics : ${hero.comics.available}</span>
            <span class="series">Series : ${hero.series.available}</span>
            <span class="stories">Stories : ${hero.stories.available}</span>
            </div>
    
        <div class="fav-buttons">
        <div class="favourite-button , ${isFavourite}" id="${hero.id}" >
        <input type="checkbox" class="input">
       <label for="input">Add to fav</label>
        </div>
    
        <div class="unFavourite" id="unFavourite${hero.id}">
        <i class="fa-solid fa-trash"></i>
      </div> 
        </div>
            </div> 
    
            
          </li>
            `
        });
        html.innerHTML = "";
        html.appendChild(ul);
        //calling handle event to handle the events on newly created elements
        handleEvent(hero_data);
    }
    
    //functon for handling events
    function handleEvent(hero_data, target) {
        //Event listener for adding to favourite
        hero_data.forEach(hero => {
            let checkbox = document.getElementById(hero.id);
            checkbox.addEventListener("click", () => {
                addToFavourites(hero);
            })
        })
        //Event listener for removing from favourite   
        hero_data.forEach(hero => {
            let unFavourite = document.getElementById("unFavourite" + hero.id)
            unFavourite.addEventListener("click", () => {
                removeFromFavourite(hero, target);
            })
        })
       // Event for getting hero info in new page
        hero_data.forEach(hero => {
            let more_info = document.getElementById("more-info" + hero.id)
            more_info.addEventListener("click", () => {
                //setting the hero info in local storage so that we can access in more-info.js
                
                localStorage.setItem("get-hero-info",JSON.stringify(hero));
                const url = `more-info.html`;
                window.open(url, '_blank');
            })
        })
    
    }
    //function to load favourie heroes on the screen
    function loadFavourite() {
        let favourite_list = JSON.parse(localStorage.getItem("favourite_heroes"));
        if (favourite_list === null) {
            return;
        }
        let ul = document.createElement("ul")
    
        favourite_list.forEach(hero => {
            let isFavourite = "";
            if (localStorage.getItem(hero.id) != undefined) {
                isFavourite = "checked";
            }
    
            ul.innerHTML += ` 
            <li>
            <div>
            <div id="more-info${hero.id}" data-id="${hero.id}">
            <img src="${hero.thumbnail.path + '/portrait_medium.' + hero.thumbnail.extension}" alt="">
                   <span class="hero-name">${hero.name}</span>
              </div>
    
            <div class="hero_info" id="hero_id_${hero.id}"> 
            <span class="id">Id : ${hero.id}</span>
            <span class="comics">Comics : ${hero.comics.available}</span>
            <span class="series">Series : ${hero.series.available}</span>
            <span class="stories">Stories : ${hero.stories.available}</span>
            </div>
    
        <div class="fav-buttons">
        <div class="favourite-button , ${isFavourite}" id="${hero.id}" >
        <input type="checkbox" class="input">
       <label for="input">Add to fav</label>
        </div>
    
        <div class="unFavourite" id="unFavourite${hero.id}">
        <i class="fa-solid fa-trash"></i>
      </div> 
        </div>
    
       
            </div> 
          </li>
            `
        });
    
        html.innerHTML = "";
        html.appendChild(ul);
    
        handleEvent(favourite_list, "favourite");
    
    }
    
    
    //function to add hero to favourite list
    function addToFavourites(hero) {
    
        if (localStorage.getItem(hero.id) == undefined) {
            //getting list of heroes from local storage and if not present then creating one
            let favourite_list = JSON.parse(localStorage.getItem("favourite_heroes"));
            if (favourite_list === null) {
                favourite_list = [];
                favourite_list.push(hero);
                favourite_list = JSON.stringify(favourite_list);
                localStorage.setItem("favourite_heroes", favourite_list);
    
            } else {
                favourite_list.push(hero);
                favourite_list = JSON.stringify(favourite_list);
                localStorage.setItem("favourite_heroes", favourite_list);
            }
            localStorage.setItem(hero.id, hero);
            document.getElementById(hero.id).classList.add("checked");
        } else {
            document.getElementById(hero.id).classList.add("checked");
        }
    }
    
    //function to remove hero from favourite list
    
    function removeFromFavourite(hero, target) {
        //checking whether hero id is present in the local storage
        if (localStorage.getItem(hero.id) === undefined) {
            return;
        } else {
            localStorage.removeItem(hero.id);
            document.getElementById(hero.id).classList.remove("checked");
            let favourite_list = JSON.parse(localStorage.getItem("favourite_heroes"));
            let temp_favourite_list = favourite_list.filter((character) => {
                if (hero.id != character.id) {
                    return character;
                }
            })
            favourite_list = temp_favourite_list;
            favourite_list = JSON.stringify(favourite_list);
    
            localStorage.setItem("favourite_heroes", favourite_list);
    
            if (target === "favourite") {
                loadFavourite();
            }
        }
    
    }


})();







