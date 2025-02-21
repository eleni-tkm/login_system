// Updated translations with "ourResources"
const translations = {
    en: {
        "home": "HOME",
        "knowledgeLibrary": "KNOWLEDGE LIBRARY",
        "poolExperts": "POOL OF EXPERTS",
        "welcomeText": "Welcome to the Knowledge Repository Hub",
        "introText": "Explore a comprehensive collection of resources dedicated to advancing research, policy-making, and global collaboration. Our repository features a diverse range of materials including scientific papers, case studies, financial instruments, and expert insights. Designed for anyone passionate about protecting our planet's biodiversity.",
        "exploreButton": "Explore resources",
        "bio": "Publications on Biodiversity",
        "papers": "Papers on Legislation/Policies/Guidelines",
        "caseStudies": "Case studies",
        "experts": "National and International Experts",
        "monitoring": "Papers on Monitoring and Reporting",
        "projects": "Multiregional Biodiversity Projects",
        "funding": "Conservation Funding Opportunities",
        "loadMore": "Load More",
        "contact": "Contact",
        "contactText": "Republic of Moldova, Chisinau",
        "email": "E-mail: icas@moldsilva.gov.md",
        "phone": "Tel: +373 22 59-33-51",
        "fax": "Fax: +373 22 59-33-51",
        "footer": " Company, Inc",
        "hide" : 'Hide',
        "homef" : 'Home',
        "ourResources": "Our Resources",
        "Name" : "Name",
        "Sirname" : "Sirname",
        "Specialization" : "Specialization",
        "Nationallity": "Nationallity"
        
        // Added key here
    },
    ro: {
        "home": "ACASĂ",
        "knowledgeLibrary": "BIBLIOTECA CUNOȘTINȚELOR",
        "poolExperts": "BAZIN DE EXPERȚI",
        "welcomeText": "Bun venit la Hub-ul de Repozitare a Cunoștințelor",
        "introText": "Explorați o colecție completă de resurse dedicate avansării cercetării, luării deciziilor și colaborării globale. Repozitorul nostru include o gamă diversă de materiale, inclusiv lucrări științifice, studii de caz, instrumente financiare și perspective de experți. Creat pentru oricine pasionat de protejarea biodiversității planetei noastre.",
        "exploreButton": "Explorați resursele",
        "bio": "Publicații pe Biodiversitate",
        "papers": "Lucrări privind legislația/politicile/ghidurile",
        "caseStudies": "Studii de caz",
        "experts": "Experți Naționali și Internaționali",
        "monitoring": "Lucrări despre Monitorizare și Raportare",
        "projects": "Proiecte Multiregionale de Biodiversitate",
        "funding": "Oportunități de Finanțare",
        // "loadMore": "Încarcă mai mult",
        "contact": "Contactați-ne",
        "contactText": "Republica Moldova, Chișinău",
        "email": "E-mail: icas@moldsilva.gov.md",
        "phone": "Tel: +373 22 59-33-51",
        "fax": "Fax: +373 22 59-33-51",
        "footer": " Companie, Inc",
        "ourResources": "Resursele Noastre", // Added translation here
        "homef" : "Acasă",
        "hide" : 'Ascunde',
        "knowledgeLibraryf" : "Biblioteca cunoștințelor",
        "poolExpertsf" : "Bazin de experți",
        "Name" : "Nume",
        "Sirname" : "Sirname",
        "Specialization" : "Specializare",
        "Nationallity": "Naţionalitate"

    }
};

// Function to update the page with the selected language
function translatePage(language) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.innerText = translations[language][key];
        }
    });

   
}

// Event listener for language change
document.querySelectorAll('.flag-button').forEach(button => {
    button.addEventListener('click', () => {
        const language = button.getAttribute('data-language');
        translatePage(language);
    });
});

// Initial translation to English
translatePage('en');
