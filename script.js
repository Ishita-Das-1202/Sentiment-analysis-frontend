document.addEventListener("DOMContentLoaded", () => {
    const reviewsContainer = document.getElementById("reviews-container");
    const addReviewButton = document.getElementById("add-review");
    const analyzeButton = document.getElementById("analyze");
    const resetButton = document.getElementById("reset");
  
    // Add a new review input
    addReviewButton.addEventListener("click", () => {
      const reviewDiv = document.createElement("div");
      reviewDiv.className = "review-input";
      reviewDiv.innerHTML = `
        <input type="text" placeholder="Enter your review" class="review-field">
        <button class="remove-review">-</button>
      `;
      reviewsContainer.appendChild(reviewDiv);
  
      // Add functionality to remove the review input
      reviewDiv.querySelector(".remove-review").addEventListener("click", () => {
        reviewDiv.remove();
      });
    });
  
    // Analyze reviews
    analyzeButton.addEventListener("click", async () => {
      const reviewFields = document.querySelectorAll(".review-field");
      const reviews = Array.from(reviewFields).map((field) => field.value);
  
      if (reviews.length === 0 || reviews.some((review) => review.trim() === "")) {
        alert("Please enter at least one valid review.");
        return;
      }
  
      try {
        const response = await fetch(`${BASE_URL}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviews }),
        });
  
        const result = await response.json();
        const predictions = result.results;
  
        // Display predictions with emojis
        predictions.forEach((item, index) => {
          const emoji = document.createElement("span");
          emoji.className = `emoji ${item.prediction === 1 ? "smile" : "sad"}`;
          emoji.textContent = item.prediction === 1 ? "😊" : "😞";
  
          // Add the emoji beside the review
          const reviewInput = reviewFields[index].parentElement;
          if (!reviewInput.querySelector(".emoji")) {
            reviewInput.appendChild(emoji);
          }
        });
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to analyze reviews. Please try again.");
      }
    });
  
    // Reset the form
    resetButton.addEventListener("click", () => {
      reviewsContainer.innerHTML = `
        <div class="review-input">
          <input type="text" placeholder="Enter your review" class="review-field">
          <button class="remove-review">-</button>
        </div>
      `;
    });
  });
  