




























const navObject = {
    name: "Variables",
    tab: "Variables",
    buttons: [
        binNumericVariables.nav,
        {
            name: "Compute",
            icon: "icon-calculator",
            children: [
                applyFunctionAcrossRows.nav,
                computeDummyVariables.nav,
            ]
        },
        concatenateVariables.nav,
        {
            name: "Convert",
            icon: "icon-exchange",
            children: [
                convertToFactor.nav,
                convertDateToString.nav,
                convertStringToDate.nav
            ]
        },
        deleteVariables.nav,
        {
            name: "Factor Levels",
            icon: "icon-shapes",
            children: [
                addNewLevels.nav,
                displayLevels.nav,
                dropUnusedLevels.nav,
                labelNAasMissing.nav,
                lumpIntoOther.nav,
                specifyLevelsToKeepOrReplace.nav,
                reorderByCount.nav,
                reorderByOccurance.nav,
                byAnotherVariable.nav,  
            ]
        },
        {
            name: "Missing Values",
            icon: "icon-na",
            children: [
                removeNAs.nav,
                missingValuesBasic.nav,
                replaceMissingValues.nav,
                missValsModelImputation.nav,
                missValsFormula.nav]
        },
        rankVariables.nav,
        recodeVariables.nav,
        standardizeVariables.nav,
        transformVariables.nav,
    ]
}

module.exports = {
    navObject: navObject,
    modals: [
        binNumericVariables,
        concatenateVariables,
        convertToFactor,
        deleteVariables,
        recodeVariables,
        standardizeVariables,
        transformVariables,
        applyFunctionAcrossRows,
        rankVariables,
        computeDummyVariables,
        addNewLevels,
        displayLevels,
        dropUnusedLevels,
        labelNAasMissing,
        reorderByOccurance,
        reorderByCount,
        byAnotherVariable,
        specifyLevelsToKeepOrReplace,
        missingValuesBasic,
        removeNAs,
        replaceMissingValues,
        lumpIntoOther,
        convertDateToString,
        convertStringToDate,
        missValsModelImputation,
        missValsFormula
    ]
}