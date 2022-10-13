

var localization = {
    en: {
        title: "Impute Missing Values (Using a formula)",
        navigation: "Use a formula",
        depVar: "Select a variable to impute missing values for (This is the dependent variable in the model)",
        label1: "Move the independent variables into the formula builder control to construct a formula. Mouse over the symbols in the formula builder for help",
        formula: "Moving multiple variables with the move button uses a default separator of +, indicating independent variables without interaction terms. Click on the symbol to build a model with interaction terms.",
        independent: "Independent Variables (one or more)",
       
        help: {
            title: "Impute Missing Values (Using a formula)",
            r_help: "help(if_else,package='dplyr')",
            body: `
            <b>Description</b></br>
            Construct a formula to replace missing values. For example you build a regression model to develop estimates for the missing values, once the equation is generated, you can plug the equation into the dialog and only the missing values in the variable selected will be computed.
            <br/>
            <b>Usage</b>
            <br/>
            <code> 
            Dataset$var<-with (Dataset,dplyr::if_else(is.na(var),expression,var))<br/>
            # substituting expression by var2*4+1.32<br/>
            Dataset$var<-with (Dataset,dplyr::if_else(is.na(var),var2*4+1.32,var))<br/>
            </code> <br/>
            <b>Arguments</b><br/>
            <ul>
            <li>
            var: The name of the variable in dataset where missing values are to be replaced for e.g. var=c("sales"). The variable must be of class numeric
            </li>
            <li>
            Dataset: The dataset/dataframe that contains the variable var
            </li>
            <li>
            expression: The expression used to replace the missing value, in the example above its var2*4+ 1.32
            </li>
            </ul>
            <b>Package</b></br>
            dplyr</br>
            <b>Help</b></br>
            For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command help(if_else, package ='dplyr') by creating a R code chunk by clicking + in the output window
            `}
    }
}










class missValsFormula extends baseModal {
    constructor() {
        var config = {
            id: "missValsFormula",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(dplyr)
#If_else does type checking, 10 is adouble in R, 10L is an integer
#{{dataset.name}}\${{selected.depVar | safe}}<-with ({{dataset.name}}, dplyr::if_else(is.na({{selected.depVar | safe}}),{{selected.formula | safe}},{{selected.depVar | safe}}))
{{dataset.name}}\${{selected.depVar | safe}}<-with ({{dataset.name}}, base::ifelse(is.na({{selected.depVar | safe}}),{{selected.formula | safe}},{{selected.depVar | safe}}))
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
                    required: true,
                    label: localization.en.formula,
                })
            },

          
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [ objects.depVar.el.content, objects.formulaBuilder.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-formula",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new missValsFormula().render()