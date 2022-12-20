const nav = {
    "name": "Variables",
    "tab": "Variables",
    "buttons": [
        "./binNumericVariables",
        {
            "name": "Compute",
            "icon": "icon-calculator",
            "children": [
                "./applyFunctionAcrossRows",
                "./computeDummyVariables",
                "./computeVariable",
                "./conditionalCompute",
                "./conditionalComputeMayo"
                
            ]
        },
        "./concatenateVariables",
        {
            "name": "Convert",
            "icon": "icon-exchange",
            "children": [
                "./convertStringToDate",
                "./convertDateToString",
                "./convertToFactor",
                "./convertToOrdinal"
            ]
        },
        "./deleteVariables",
        {
            "name": "Factor Levels",
            "icon": "icon-shapes",
            "children": [
                "./addNewLevels",
                "./displayLevels",
                "./dropUnusedLevels",
                "./labelNAasMissing",
                "./lumpIntoOther",
                "./specifyLevelsToKeepOrReplace",
                "./reorderByCount",
                "./reorderByOccurance",
                "./byAnotherVariable"
            ]
        },
        {
            "name": "Missing Values",
            "icon": "icon-na",
            "children": [
                "./removeNAs",
                "./missingValuesBasic",
                "./replaceMissingValues",
                "./missValsModelImputation",
                "./missValsFormula"
            ]
        },
        "./rankVariables",
        "./recodeVariables",
        "./standardizeVariables",
        "./transformVariables"
    ]
}

module.exports.nav = nav

