

var localization = {
    en: {
        title: "Impute Missing Values (Using a model)",
        navigation: "Model Imputation",
        depVar: "Select a variable to impute missing values for (This is the dependent variable in the model)",
        label1: "Move the independent variables into the formula builder control to construct a formula. Mouse over the symbols in the formula builder for help",
        formula: "Moving multiple variables with the move button uses a default separator of +, indicating independent variables without interaction terms. Click on the symbol to build a model with interaction terms.",
        independent: "Independent Variables (one or more)",
        modeltype: "Select a model to impute missing values",
        modelParam: "Specify model parameters",
        help: {
            title: "Impute Missing Values (Using a model)",
            r_help: "help(impute_lm, package='simputation')",
            body: `
            <b>Description</b></br>
            We first construct a model using the variable to impute values for as the dependent variable.</br> 
            We then use the constructed model to predict values and replace missing values in the dependent variable by the predicted values</br>
            The simputation package offers a number of commonly used single imputation methods, each with a similar simple
            interface. The following imputation methodology is supported.</br>
            • linear regression</br>
            • robust linear regression</br>
            • ridge/elasticnet/lasso regression</br>
            • CART models (decision trees)</br>
            • Random forest</br>
            • Multivariate imputation</br>
            • Imputation based on the expectation-maximization algorithm</br>
            • missForest (iterative random forest imputation)</br>
            • Donor imputation (including various donor pool specifications)</br>
            • k-nearest neigbour (based on gower’s distance)</br>
            • sequential hotdeck (LOCF, NOCB)</br>
            • random hotdeck</br>
            • Predictive mean matching</br>
            • Model based (optionally add [non]parametric random residual)</br>
            • Other</br>
            (groupwise) median imputation (optional random residual)</br>
            Proxy imputation: copy another variable or use a simple transformation to compute imputed values.</br>
            <br/>
            <b>Usage</b>
            <br/>
            A call to an imputation function has the following structure.</br>
            impute_ModelType(data, formula, [model-specific options])</br>
            The output is similar to the data argument, except that empty values are imputed (where possible) using the specified model.</br>
            The formula argument specifies the variables to be imputed, the model specification for <model> and possibly the grouping of the dataset. </br>
            The structure of a formula object is as follows:</br>
            VARIABLE_TO_IMPUTE_MISSINGVALUES ~ MODEL_SPECIFICATION [ | GROUPING ]</br>
            where the part between [] is optional.</br></br>
            See examples below and the help section to see how details on how to construct a formula. </br>
            In examples below dependent_var is the variable to be imputed.</br>
            example 1(no interaction terms): dependent_var ~ independent_var1 + independent_var2...</br>
            example 2 (with interaction terms): dependent_var ~ independent_var1 + independent_var2 + independent_var1:independent_var2</br></br>
            <code> 
            #For linear regression</br>
            dataset_name <- impute_lm(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            
            # For robust linear regression using the model M-estimation in the package MASS</br>
            dataset_name <- impute_rlm(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            
            ## For ridge regression using the model ridge/elasticnet/lasso in the package glmnet</br>
            dataset_name <- impute_en(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            
            ## For CART(decision trees) using the model CART in package rpart</br>
            dataset_name <- impute_cart(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            
            ## For RandomForest using the model random forest in package randomForest</br>
            dataset_name <- impute_rf(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            
            ##For Multivariate Imputation based on the expectation-maximization algorithm in package norm</br>
            dataset_name <- impute_em(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            ##For Multivariate Imputation based on missForest (=iterative random forest imputation) in the package missForest</br>
            dataset_name <- impute_mf(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            
            ##Donor imputation (including various donor pool specifications), k-nearest neighbor (based on gower’s distance) in VIM package</br>
            dataset_name <- impute_knn(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            
            ##Donor imputation (including various donor pool specifications), sequential hot deck (LOCF, NOCB) in VIM package</br>
            dataset_name <- impute_shd(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br></br>
            
            ##Donor imputation (including various donor pool specifications), random hot deck in VIM package</br>
            dataset_name <- impute_rhd(dataset_name, dependent_var ~ independent_var1 + independent_var2...)</br>
            </code> <br/>
            <b>Package</b></br>
            simputation and other packages based on the imputation method selected. See above</br>
            <b>Help</b></br>
            For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command help(impute_lm, package='simputation') by creating a R code chunk by clicking + in the output window</br>
            <b>Useful URLs</b></br>
            https://cran.r-project.org/web/packages/simputation/vignettes/intro.html
            `}
    }
}










class missValsModelImputation extends baseModal {
    constructor() {
        var config = {
            id: "missValsModelImputation",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require("simputation")
local({
    packageToLoad = switch("{{selected.modeltype | safe}}",
    "impute_rlm"="MASS", "impute_en"="glmnet", "impute_cart"="rpart", "impute_rf"="randomForest", "impute_rhd"="VIM", "impute_shd"="VIM", "impute_knn"="VIM", "impute_mf"="missForest", "impute_em"="norm") 
    
    #Load required package
    require(packageToLoad,character.only = TRUE)
    
    #Impute missing values
    .GlobalEnv\${{dataset.name}} ={{selected.modeltype | safe}}({{dataset.name}}, {{selected.depVar | safe}}~{{selected.formula | safe}})
    })
    #Refresh the dataset in the grid
    BSkyLoadRefresh("{{dataset.name}}")
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            depVar: {
                el: new dstVariable(config, {
                    label: localization.en.depVar,
                    no: "depVar",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            label1: {el: new labelVar(config, {no: 'label1', label: localization.en.label1, style: "mt-3",h: 9}) },
            formulaBuilder: {
                el: new formulaBuilder(config, {
                    no: "formula",
                    required:true,
                    label: localization.en.formula,
                })
            },

            modeltype: {
                el: new comboBox(config, {
                    no: 'modeltype',
                    label: localization.en.modeltype,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["impute_rlm", "impute_en", "impute_cart", "impute_rf", "impute_rhd","impute_shd", "impute_knn", "impute_mf","impute_em"],
                    default: "impute_rlm",
                })
            },
            modelParam: {
                el: new input(config, {
                    no: 'modelParam',
                    label: localization.en.modelParam,
                    placeholder: "",
                    type: "character",
                    allow_spaces:true,
                    extraction: "TextAsIs",
                    value: ""
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [ objects.depVar.el.content, objects.formulaBuilder.el.content,  objects.modeltype.el.content, objects.modelParam.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-logistic_formula",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new missValsModelImputation().render()