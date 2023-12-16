import customFetch from "./fetch.js";
import { ENDPOINT, LIMIT } from "./const.js";

const postsRow = document.querySelector(".posts-row");
const searchInput = document.querySelector("input");
const totalPosts = document.querySelector(".total-posts");
const pagination = document.querySelector(".pagination");

let search = "";
let activePage = 1;

async function getPosts() {
  try {
    let params = {
      q: search,
      _page: activePage,
      _limit: LIMIT,
    };
    const query = new URLSearchParams(params);

    postsRow.innerHTML = "Loading...";

    const p1 = customFetch(`${ENDPOINT}posts?q=${search}`);
    const p2 = customFetch(`${ENDPOINT}posts?${query}`);

    const [posts, pgtnPosts] = await Promise.all([p1, p2]);

    let pages = Math.ceil(posts.length / LIMIT);

    if (pages) {
      pagination.innerHTML = `
        <li class="page-item ${activePage === 1 ? "disabled" : ""}">
          <button page="-" class="page-link">Previous</button>
        </li>
      `;
      for (let i = 1; i <= pages; i++) {
        pagination.innerHTML += `
        <li class="page-item ${i === activePage ? "active" : ""}">
          <button page="${i}" class="page-link">${i}</button>
        </li>
      `;
      }

      pagination.innerHTML += `
        <li class="page-item ${activePage === pages ? "disabled" : ""}">
          <button page="+"  class="page-link">Next</button>
        </li>
      `;
    } else {
      pagination.innerHTML = "";
    }

    totalPosts.textContent = posts.length;

    postsRow.innerHTML = "";
    if (posts.length) {
      pgtnPosts.map((post) => {
        postsRow.innerHTML += `
          <div>
            <h3>${post.id}. ${post.title}</h3>
            <p>${post.body}</p>
          </div>
        `;
      });
    } else {
      postsRow.innerHTML = "No posts";
    }
  } catch (err) {
    alert(err);
  }
}

getPosts();

searchInput.addEventListener("keyup", function () {
  search = this.value;
  activePage = 1;
  getPosts();
});

pagination.addEventListener("click", (e) => {
  let page = e.target.getAttribute("page");
  getPage(page);
});

function getPage(page) {
  if (page === "+") {
    activePage++;
  } else if (page === "-") {
    activePage--;
  } else {
    activePage = +page;
  }
  getPosts();
}
