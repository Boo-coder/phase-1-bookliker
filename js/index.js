document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.getElementById("list-panel");
    const list = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    const currentUser = {"id": 1, "username": "pouros"};
    let currentId;
    fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(data => {
        data.forEach(book => {
            const li = document.createElement("li");
            li.textContent = book.title;

            li.addEventListener("click", () => {
                currentId = book.id;
                showPanel.innerHTML = "";

                const thumbnail = document.createElement("img");
                thumbnail.src = book.img_url;

                const description = document.createElement("p");
                description.textContent = book.description;

                const userList = document.createElement("ul");
                book.users.forEach(user => {
                    const userLi = document.createElement("li");
                    userLi.textContent = user.username;
                    userList.appendChild(userLi);
                });

                const likeBttn = document.createElement("button");
                likeBttn.textContent = "LIKE";
                likeBttn.addEventListener("click", () => {
                    if(book.users.some(user => user.id === currentUser.id)){
                        book.users = book.users.filter(user => user.id !== currentUser.id);
                    } else {
                        book.users.push(currentUser);
                    }
                    fetch(`http://localhost:3000/books/${currentId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({users: book.users})
                    })
                    .then(res => res.json())
                    .then(updatedBook => {
                        console.log("Success", updatedBook);

                        userList.innerHTML = "";                       
                        updatedBook.users.forEach(user => {
                            const userLi = document.createElement("li");
                            userLi.textContent = user.username;
                            userList.appendChild(userLi);
                        });

                        updateBttnText(likeBttn, updatedBook);
                    })
                    .catch(error => console.error("Error:", error));
                });

                showPanel.appendChild(thumbnail);
                showPanel.appendChild(description);
                showPanel.appendChild(userList);
                showPanel.appendChild(likeBttn);

            });

            list.appendChild(li);
        });
    });

    function updateBttnText(button, book){
        if(book.users.some(user => user.id === currentUser.id)){
            button.textContent = "UNLIKE";
        } else {
            button.textContent = "LIKE";
        }
    }
});