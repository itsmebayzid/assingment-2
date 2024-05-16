const categoriesContainer = document.getElementById('categories')
const videosContainer = document.getElementById('videos')

// load all categories
const loadCategories = async() => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const result = await res.json();
    const data = result.data;
    displayCategories(data)
}
// set all categories in categories container
const displayCategories = (categories) => {
    categories.forEach(item => {
        const button = document.createElement("button");
        button.innerText = `${item.category}`;
        button.setAttribute('class', `btn ${item.category}`)
        button.setAttribute('onclick', `loadVideos(${item.category_id})`)        
        categoriesContainer.appendChild(button)
    })

    // initially show all videos of all category
    loadVideos(categories[0].category_id);
}

loadCategories()

// load all videos for individual category
const loadVideos = async(id) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
    const result = await res.json();
    const data = result.data;
    displayAllVideos(data);
}

const displayAllVideos = (videos) => {
    videosContainer.innerText = "";
    if(videos.length){  

        // sorted videos by clicking sortByViewBtn;
        const sortByViewBtn = document.getElementById("sort-by-view");
        sortByViewBtn.addEventListener('click', () =>{
            sortByView(videos)
            // clean previous items
            videosContainer.innerText = "";
            // display sorted videos
            showVideoInCard(videos);
        } ) 
        // display all videos in card
        showVideoInCard(videos)

    }else{
        videosContainer.removeAttribute('class');
        videosContainer.innerHTML = `
        <div class="max-w-sm mx-auto my-20 text-center">
            <img class="mx-auto mb-8" src="images/Icon.png" alt="no video image" />
            <h2 class="text-3xl font-bold">Oops!! Sorry, There is no content here</h2>
        </div>
        `
    }
}

// show video in card
function showVideoInCard(videos){
    videos.forEach(video => {
            
        // find posted_date and formate it
        let postedTime = video?.others?.posted_date
        
        let years = postedTime / (60*60*24*365)
        let postedYears = Math.floor(years);
        
        postedTime = postedTime % (60*60*24*365);
        let months = postedTime / (60*60*24*30)
        let postedMonths = Math.floor(months);

        postedTime = postedTime % (60*60*24*30)
        let days = postedTime / (60*60*24);
        let postedDays = Math.floor(days);
        
        postedTime = postedTime % (60*60*24)
        let hours = postedTime / (60*60);
        let postedHours = Math.floor(hours);
        
        postedTime = postedTime % (60*60);
        let minutes = postedTime / 60;
        let postedMinutes = Math.floor(minutes)
        
        postedYears = postedYears > 0 ? `${postedYears}yrs`: "";
        postedMonths = postedMonths > 0 ? `${postedMonths}mths` : "";
        postedDays = postedDays > 0 ? `${postedDays}days` : "";
        postedHours = postedHours > 0 ? `${postedHours}hrs` : "";
        postedMinutes = postedMinutes > 0 ? `${postedMinutes} min` : "";
        
        // posted_date output
        let postedDate = `${postedYears} ${postedMonths} ${postedDays} ${postedHours} ${postedMinutes}`;
        
        postedDate = postedDate != "    " ? `${postedDate} ago` : ""
        
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
        <figure class="relative">
        <img class="rounded-xl max-h-40 w-full" src="${video.thumbnail}" alt="video" />
        ${postedDate ? `<span class="absolute bottom-3 right-3 bg-slate-900 text-white p-2 rounded-md text-xs">${postedDate}</span>` : ""} 
        </figure>
        <div class="card-body p-0 pt-5">
        <div class="flex gap-3">
        <img  class="w-10 h-10 rounded-full" src="${video?.authors[0]?.profile_picture}" alt="author" />
        <h2 class="card-title">${video.title}</h2>
        </div>
        <div class="flex gap-2 pl-14">
        <span>${video?.authors[0]?.profile_name}</span>
        ${video?.authors[0]?.verified ? `<span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clip-path="url(#clip0_11_34)">
        <path d="M19.375 10.0001C19.375 10.8001 18.3922 11.4595 18.1953 12.197C17.9922 12.9595 18.5063 14.022 18.1203 14.6892C17.7281 15.3673 16.5484 15.4486 15.9984 15.9986C15.4484 16.5486 15.3672 17.7282 14.6891 18.1204C14.0219 18.5064 12.9594 17.9923 12.1969 18.1954C11.4594 18.3923 10.8 19.3751 10 19.3751C9.2 19.3751 8.54062 18.3923 7.80312 18.1954C7.04062 17.9923 5.97813 18.5064 5.31094 18.1204C4.63281 17.7282 4.55156 16.5486 4.00156 15.9986C3.45156 15.4486 2.27187 15.3673 1.87969 14.6892C1.49375 14.022 2.00781 12.9595 1.80469 12.197C1.60781 11.4595 0.625 10.8001 0.625 10.0001C0.625 9.20012 1.60781 8.54075 1.80469 7.80325C2.00781 7.04075 1.49375 5.97825 1.87969 5.31106C2.27187 4.63293 3.45156 4.55168 4.00156 4.00168C4.55156 3.45168 4.63281 2.272 5.31094 1.87981C5.97813 1.49387 7.04062 2.00793 7.80312 1.80481C8.54062 1.60793 9.2 0.625122 10 0.625122C10.8 0.625122 11.4594 1.60793 12.1969 1.80481C12.9594 2.00793 14.0219 1.49387 14.6891 1.87981C15.3672 2.272 15.4484 3.45168 15.9984 4.00168C16.5484 4.55168 17.7281 4.63293 18.1203 5.31106C18.5063 5.97825 17.9922 7.04075 18.1953 7.80325C18.3922 8.54075 19.375 9.20012 19.375 10.0001Z" fill="#2568EF"/>
        <path d="M12.7094 7.20637L9.14062 10.7751L7.29062 8.92668C6.88906 8.52512 6.2375 8.52512 5.83594 8.92668C5.43437 9.32824 5.43437 9.97981 5.83594 10.3814L8.43125 12.9767C8.82187 13.3673 9.45625 13.3673 9.84687 12.9767L14.1625 8.66106C14.5641 8.25949 14.5641 7.60793 14.1625 7.20637C13.7609 6.80481 13.1109 6.80481 12.7094 7.20637Z" fill="#FFFCEE"/>
        </g>
        <defs>
        <clipPath id="clip0_11_34">
        <rect width="20" height="20" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        </span>` : ""}
        </div>
        <span class="pl-14">${video?.others?.views} views</span>
        </div>
        `
        !videosContainer.getAttribute('class') ? videosContainer.setAttribute('class', "grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mx-3 md:mx-0 gap-6") : "";
        videosContainer.appendChild(div)
    })
}

// sort by view functional
const sortByView = (videos) => {
    videos = videos.sort((a, b) => b.others.views.slice(0, -1) - a.others.views.slice(0, -1));
    return videos;
}