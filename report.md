# Report

## Angular vs Vanilla JavaScript

The use of the Angular Framework has made the development of a Single-Page Application agreeable, as it provides many modules to do so. The navigation between
the pages of the application was possible due to the RouterModulelink module of the angular router. Once the list of routes defined, the navigation could be done 
with the navigate function, which automaticaly sends the user to the right page. Therefore, the view and and the URL did not have to be manually adapted, as
was the case in the vanilla-JS application. For the storage, the HttpClientInMemoryWebApiModule of the InMemoryDataService gives the possibility to store the 
data on a simulated server, thus avoiding to save it on a local storage of the browser or on a database. For HTTP requests, the HttpClient is needed, which returns 
the data on an Observable for transmission between pages. However, Observables pass values asynchronously, enhancing the difficulty for the implementation. To handle 
this, promises were being used. In general, the TypeScript language was confortable to use for programming, as I am mainly used to object oriented programming languages. 
The structure already provided by Angular also makes it comfortable to use. In general I could say, that the Angular framework takes some time to learn, as it offers 
many features, but once mastered, much time can be saved compared to the use of vanilla-JS. <br>

## Learnings and challenges

During the programming of this todo application, I have therefore learned a lot about some of the features and possibilities offered by Angular. Not without challenges, 
as Observables can be difficult to handle. I also had some compatibility issues between modules, espacially with those provided by third parties. In addition, I 
could better understand the differences between JavaScript and TypeScript and I must admit, that I became quite found of TypeScript. To conclude, I would definitly 
recommend the use of the Angular Framework and the TypeScript language, although with the recommandation to spend some time learning and practicing first.
