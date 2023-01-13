const nav = {
    "name": "Variables",
    "tab": "Variables",
    "buttons": [
        "./binNumericVariables",
        {
            "name": "Box-Cox",
            "icon": "icon-sixsigma",
            "children": [
                "./normalityBoxCoxAddRemoveLambda",
                "./normalityBoxCoxTransform",
                "./normalityBoxCoxInspection",
                "./normalityInverseBoxCox"
            ]
        },        			
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
                "./convertDateToString",
                "./convertStringToDate",
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
				"./byAnotherVariable",
                "./reorderByOccurance",
            ]
        },
        {
            "name": "Missing Values",
            "icon": "icon-na",
            "children": [
                "./replaceMissingValues",
                "./missValsModelImputation",
                "./missingValuesBasic",
                "./removeNAs",
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

