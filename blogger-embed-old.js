function checkDateDiff(dateParamStr, minutes=10) {
  const dateParam = new Date(dateParamStr);
  
  // Convert minutes to milliseconds
  const millisecondsDiff = minutes * 60 * 1000;

  // Calculate the difference between the current date and the dateParam
  const timeDifference = new Date() - dateParam;
  // Check if the time difference is greater than the specified minutes
  return timeDifference > millisecondsDiff;
}

function decodeJSON(obfuscatedString) {
  // 1. Base64 decode and parse JSON
  let decoded = atob(obfuscatedString);

  // 2. remap original characters
  const mapping = {
    '","': "~",
    "','": "~",
    '":"': "@",
    "':'": "@",
    '{"': "$",
    "{'": "$",
    '"}': "!",
    "'}": "!",
  };

  for (const key in mapping) {
    const val = mapping[key];
    decoded = decoded.replaceAll(val, key);
  }
  const jsonObject = JSON.parse(decodeURIComponent(decoded));

  return jsonObject;
}

// Function to parse URL query parameters
function getQueryParam(name) {
  const url = window.location.search;
  const regex = /v=([^&=?]*)/;
  const match = url.match(regex);

  return match ? match[1] : null;
}




// After page load
$(document).ready(function () {
  // Check if the 'v' query parameter exists
  const videoParam = getQueryParam("v");

  // Define the regular expression pattern to match the URL structure
  const urlPattern = /\/\d{4}\/\d{2}\/[^\/]+\.html\?v=.+/;

  // Get the current URL
  const currentURL = window.location.href;

  // Check if the current URL matches the pattern
  if (urlPattern.test(currentURL) && videoParam) {
    let data = decodeJSON(decodeURIComponent(videoParam));
    
    if (data && data?.s && data?.p && data?.b && data?.n && data?.title && data?.d) {

      // Create a style element
      var mobileStyles = document.createElement('style');
     
      // Add the CSS rule to the style element
      mobileStyles.textContent = `
        .btn-purple {
          background-color: #8614f8;
          background-image: linear-gradient(#8614f8 0, #760be0 100%);
          border-radius: 5px;
          border-style: none;
          box-shadow: rgba(245, 244, 247, 0.25) 0 1px 1px inset;
          color: #fff;
          display: inline-block;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.05, 0.03, 0.35, 1);
          touch-action: manipulation;
          vertical-align: bottom;
         }
    
        .btn-purple:hover {
          opacity: 0.8;
          color:#fff;
        }
        .responsive-fs {
            /* Default font size for all devices */
            font-size: 1rem !important;
          }
          
          @media (max-width: 768px) {  /* Target screens smaller than 768px (common mobile breakpoint) */
            .responsive-fs {
              font-size: 0.85rem !important;  /* Adjust font size for mobile */
            }
          }`;
      $('head').append(mobileStyles)
      
      $("#go-watch").html(
        `<a class='btn btn-purple' style='opacity:.6;' href='#'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" style="scale:1.6;"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle></svg></a>`
      );
    // After 1 second, replace the SVG content with the title
    setTimeout(function() {
        
      if(checkDateDiff(data.d,20)) {
        window.location.href = data.b
      } else {
        $("#go-watch").html(
            `<a class='btn btn-purple responsive-fs' href='#watch-container'>
                ${decodeURIComponent(data.title).replace('الحلقة' ,'شاهد الحلقة')}
            </a>`
        );
      }
    }, 1500);
      // Get the element with ID 'watch-container'
      const watchContainer = $("<div id='watch-container'></div>");
      // Append the watchContainer after the article element
      $("article").after(watchContainer);

      watchContainer.html(`
          <div class='pt-2'>
            <div class='btn btn-purple mx-auto mb-1 d-table responsive-fs'>${decodeURIComponent(data.title) }</div>
          </div>
          <ul class='servers list-unstyled d-flex flex-wrap justify-content-center align-items-center mt-2 mb-1'>
            ${data.s
              .split("|")
              .map((s) => s.replace("-", " ").split("_"))
              .map(
                (s, index) =>
                  `<li><button onclick="(() => { $('#watch').attr('src', '${
                    s[1]
                  }'); $('.btn-secondary').toggleClass('btn-secondary btn-outline-secondary'); $(this).toggleClass('btn-outline-secondary btn-secondary') })()"
               class="btn btn-sm btn-${
                 index === 0 ? "" : "outline-"
               }secondary m-1 text-capitalize">${s[0]}</button></li>`
              )
              .join("")}
          </ul>

          <iframe id='watch' class='w-100' style='aspect-ratio:16/9; background-color: rgba(57, 62, 71,0.35);' src='${
            data.s.split("|")[0].split("_")[1]
          }' allowfullscreen></iframe>
          
          <div class='d-flex align-items-center justify-content-between mt-1 mb-3 responsive-fs'>
            <a class='btn btn-sm btn-purple pe-3' href='${data.p}'>
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
              الحلقة السابقة
          </a>

            <a class='btn btn-sm mx-1 btn-primary' href='${data.b}'>العودة</a>

            <a class='btn btn-sm btn-purple ps-3 responsive-fs' href='${
              data.n
            }'>الحلقة التالية
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
            </a>
          </div>`);
    }
  }
});
