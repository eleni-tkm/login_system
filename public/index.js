        // Splash screen timeout
        window.addEventListener('load', function() {
            setTimeout(function() {
                document.getElementById('splash').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            }, 700);
        });


        var dropDowns=document.querySelectorAll(".nav-link.dropdown-toggle");
        
        // for (i=0; i < dropDowns.length; i++){
        //     dropDowns[i].addEventListener("click", function(){
        //         console.log(this);
                
        //         this.classList.toggle("pressed");
                
        //         // setTimeout(function(){
        //         //     dropDowns.classList.remove("pressed");
        //         // } , 200);
        //     })
        // }
		
		


        // Enable dropdown-submenu functionality
        $(document).ready(function() {
            $('.dropdown-submenu a.dropdown-toggle').on("click", function(e) {
                if (!$(this).next().hasClass('show')) {
                    $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
                }
                var $subMenu = $(this).next(".dropdown-menu");
                $subMenu.toggleClass('show');

                $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
                    $('.dropdown-submenu .show').removeClass("show");
                });

                return false;
            });

        });

        if (window.matchMedia("(max-width: 992px)").matches) {
            var elements=document.querySelectorAll('.dropend');
            for (var i=0; i<elements.length; i++) {
                elements[i].classList.remove("dropend");
            //console.log(elements);
            
            }
        }

        document.getElementById("year").innerHTML = new Date().getFullYear();

        //TRANSLATION
        // document.addEventListener('DOMContentLoaded', function () {
        //     const flagButtons = document.querySelectorAll('.flag-button');
        
        //     const translations = {
        //         en: {
        //             title: 'Hello, World!',
        //             description: 'This is a simple language switcher example.'
        //         },
        //         de: {
        //             title: 'Hallo, Welt!',
        //             description: 'Dies ist ein einfaches Beispiel für einen Sprachwechsler.'
        //         },
        //         es: {
        //             title: '¡Hola, Mundo!',
        //             description: 'Este es un ejemplo simple de un cambiador de idioma.'
        //         }
        //     };
        
        //     flagButtons.forEach(button => {
        //         button.addEventListener('click', function () {
        //             const selectedLanguage = button.getAttribute('data-language');
        //             const translation = translations[selectedLanguage];
        
        //             document.getElementById('title').textContent = translation.title;
        //             document.getElementById('description').textContent = translation.description;
        //         });
        //     });
        // });

// JavaScript for toggling div visibility and button text

// Function to get current language from the selected flag button
let currentLang = 'en'; // Default language is English

// Event listener to detect language change
document.querySelectorAll('.flag-button').forEach(button => {
    button.addEventListener('click', function() {
        currentLang = this.getAttribute('data-language');
        updateButtonText(); // Update button text when language changes
    });
});

// Function to update button text based on the current language
function updateButtonText() {
    const loadMoreButton = document.getElementById('loadMoreButton');
    
    // Set button text based on current language
    if (currentLang === 'ro') {
        loadMoreButton.textContent = 'Încarcă mai multe'; // Romanian translation
    } else {
        loadMoreButton.textContent = 'Load More'; // Default to English
    }
}



document.getElementById('loadMoreButton').addEventListener('click', function() {
    // Toggle visibility of additional resources (res5 - res9)
    const hiddenDivs = document.querySelectorAll('#res4, #res5, #res6, #res7, #res8, #res9');
    
    // Toggle visibility of hidden divs
    hiddenDivs.forEach(function(div) {
        div.classList.toggle('hidden');  // Remove or add the 'hidden' class
    });

    // Check button text content and toggle based on the current language
    if (currentLang === 'ro') {
        if (this.textContent === 'Încarcă mai multe') {
            this.textContent = 'Ascunde'; // Change to 'Hide' in Romanian
        } else {
            this.textContent = 'Încarcă mai multe'; // Change to 'Load More' in Romanian
        }
    } else {
        if (this.textContent === 'Load More') {
            this.textContent = 'Hide'; // Change to 'Hide' in English
        } else {
            this.textContent = 'Load More'; // Change to 'Load More' in English
        }
    }
});

// Optional: Add styling for the 'hidden' class
document.styleSheets[0].insertRule('.hidden { display: none; }', 0);



