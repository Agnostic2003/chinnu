// CHINNU BIRTHDAY DRAFT/script.js
document.addEventListener("DOMContentLoaded", function () {
  loadWishesFromServer("special-wishes-list");
});

async function submitWish() {
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");
  const imageInput = document.getElementById("image");

  if (nameInput.value.trim() === "" || messageInput.value.trim() === "") {
    alert("Please fill in both your name and birthday message.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/submitWish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput.value,
        message: messageInput.value,
        image: imageInput.value,
      }),
    });

    if (response.status === 201) {
      loadWishesFromServer("special-wishes-list");
      nameInput.value = "";
      messageInput.value = "";
      imageInput.value = "";
    } else {
      alert("Error submitting wish. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Error submitting wish. Please try again.");
  }
}

async function loadWishesFromServer(listId) {
  const wishesList = document.getElementById(listId);

  try {
    const response = await fetch("http://localhost:3001/getWishes");
    const wishes = await response.json();

    wishesList.innerHTML = "";

    wishes.forEach((wish) => {
      const wishItem = document.createElement("li");
      wishItem.innerHTML = `<strong>${wish.name}:</strong> ${wish.message}`;

      if (wish.image && wish.image.trim() !== "") {
        const image = document.createElement("img");
        image.src = wish.image;
        wishItem.appendChild(image);
      }

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", async function () {
        await deleteWishFromServer(wish._id);
        loadWishesFromServer(listId);
      });
      wishItem.appendChild(deleteButton);

      wishesList.appendChild(wishItem);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Error loading wishes. Please try again.");
  }
}

async function deleteWishFromServer(wishId) {
  try {
    const response = await fetch(`http://localhost:3001/deleteWish/${wishId}`, {
      method: "DELETE",
    });

    if (response.status !== 204) {
      alert("Error deleting wish. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Error deleting wish. Please try again.");
  }
}
