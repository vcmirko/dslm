# DSLM
Dit is een clientside applicatie.  Geen internet of server nodig.  
Ze is reeds gecompileerd onder `/dist`, je kan de inhoud onder dist gewoon hosten op een locale webserver.  
Gebruik [tiny.exe](https://www.ritlabs.com/en/products/tinyweb/download.php) als je een heel eenvoudige en kleine webserver wil.  
Host alle media (foto's en filmpjes en geluidsfragmenten) in onderstaande structuur.  
De 369 ronde ondersteunt voor elke vraag ook media (foto, filmpje, geluid), wat de 369 ronde veel leuker maakt.  
  
De gallerij ronde ondersteunt voor elk antwoord een foto (uiteraard) en ook een review foto (handig bij bvb. verborgen logo's').  
Wees slim en geef elke foto de naam van het antwoord (spatie = underscore).  En elke review foto een achtervoegsel _review.
Dit zal je sneller vooruit helpen in de designer.

* /media
  * /369
  * /opendeur
    * /vraag1.mp4
    * /vraag1.jpg
    * ...
  * /gallerij
    * /fotoronde_1
      * /antwoord1.jpg
      * /antwoord1_review.jpg
      * ...
    * /fotoronde_2
      * /antwoord1.jpg
      * /antwoord1_review.jpg
      * ...
  * /collectiefgeheugen
    * /vraag1.mp4
    * /vraag2.mp4
    * ...

# Build zelf de code
## Install dependencies
```
npm install
npm run build
```
# Start in development (vereist vue-cli-service)
```
npm run serve

# or using nodemon
npm run start
```
