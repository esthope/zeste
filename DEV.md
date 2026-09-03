historySLice
versionSlice.incrementVersion
après la décrémentation, juste avant le prochain enregistrement, supprimer ceux au dessus

[0, 1, 2, 3, 4, 5, a6]
[0, 1, a2, 3, 4, 5, 6]
lors de l'enregistrement : 
[0, 1, 2]
[0, 1, 2, a3]

Quand un btn est appuyé ou un remplacement
Enregistre version quand modif editorState
La met dans un tableau, la marque comme active
Undo : active ancienne version au fur et à mesure
Si modifie à nouveau une version antérieure
Enregistre comme nouveau et supprimer les autres

```js
history:ConvertedToRaws[];
activeVersion:number;

// avant onChangeCase ou replace
// et avant redo et undo 
// ou avant changeRaws de homeScreen 
keepHistory = ():void => {
    convertedRaws = gerCurrentRaws();
    history.push(convertedRaws);
    currVersion = history.length - 1;
}

changeVersion = (mode:string):void => {
    
    // undo values 
    let compVersion = 1,
        newVersion = currVersion-1;
    // redo values
    if (mode === ‘redo’) {
        default = history.length-1;
        newVersion = currVersion+1;
    }
    // compare and replace
    currVersion = (currVersion === default) ? default : newVersion;
    changeRaws(history[currVersion]);
}

// change the version
changeVersion(‘redo’)
changeVersion(‘undo’)
```