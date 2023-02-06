
var localization = {
    en: {
        title: "Recode Variables",
        navigation: "Recode",
        oldvars: "Variables to Recode",
        label1: "Options",
        newvarradio: "New Variable(s)",
        newvar: "Enter new variable names separated by , for e.g. newVar1, newVar2",
        oldvarradio: "Overwrite existing variable(s)",
        suffix: "Specify a suffix for recoded variables",
        prefix: "Specify a prefix for recoded variables",
        enterSuffix: "Enter a suffix",
        enterPrefix: "Enter a prefix",
        label3: "When specifying multiple recode criteria, use the ; as a separator.",
        label4: "NOTE: STRING VALUES MUST BE ENCLOSED IN DOUBLE QUOTES(\") AND NOT SINGLE QUOTE(').",
        label5: "Enter old values and new values separated by ; for e.g. \"Male\"=\"Man\";\"Fem\"=2;\"Houston, Texas\"=\"Texas\";Not Available\"=NA ", 
        label5a: "For recoding numeric type enter 70=100;71=101;99=NA",
        label5b: "Range of values is supported, for e.g. 5:10=\"medium\" Special values lo and hi may appear in a range, for e.g. lo:10=\"low\";11:89=\"medium\";90:hi=\"High\"",
        label6: "The keyword else can be used for everything that does not fit a specification, for e.g. else =NA",
        dontMakeFactor: "By default, the recoded variable will be a factor if the source variable is a factor. To override check the checkbox",
        oldnewvals: "Enter recode criteria",
        help: {
            title: "Recode Variables",
            r_help: "help(recode, package=car)",
            body: `
<b>Description</b></br>
Recodes one or more a numeric vector, character vector, or factors according to  recode specifications. You can store the results by overwriting existing variables, specifying new variable names to store recoded values or choosing to store the recoded values in  new variables with a suitable prefix or suffix. the prefix or suffix will be applied to the existing variable name.
<br/>
<b>Usage</b>
<br/>
<code> 
BSkyRecode(colNames,newColNames,OldNewVals,NewCol=TRUE,dataSetNameOrIndex='Dataset2')
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
colNames: A character vector containing one or more variables in the dataset to recode
</li>
<li>
newColNames:  A character vector containing the names of the new columns.
</li>
<li>
OldNewVals: A character string of recode specifications in the form oldval1,newval1, oldval2,newval2
</li>
<li>
NewCol: A Boolean indicating whether recoded values are stored in new  variables (TRUE) or existing variables are overwritten(FALSE).
</li>
<li>
prefixOrSuffix: Specify if you want to store the recoded values in new variables prefixed or suffixed with the name you specify.  Enter prefix or suffix.
</li>
<li>
prefixOrSuffixString: Enter a string to use as a prefix or suffix to the existing variable name. Recoded values will be stored in these variables.
</li>
<li>
dataSetNameOrIndex: The dataset/dataframe name
</li>
</ul>
Note: We will not convert from numeric to factor. When  a numeric is recoded, it will remain a numeric, when a factor variable is recoded it will remain a factor.<br/>
<b>Package</b></br>
car</br>
<b>Help</b></br>
Type the line below in the BlueSky Statistics  R syntax editor</br>
help(recode, package=car)
`}
    }
}








class recodeVariables extends baseModal {
    constructor() {
        var config = {
            id: "recodeVariables",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(car)
#Perform the recode
BSkyRecode(colNames=c({{selected.oldvars | safe}}),{{if (options.selected.newvar !== "")}} newColNames={{selected.newvar | safe}},{{/if}} OldNewVals='{{selected.oldnewvals | safe}}',{{if (options.selected.g1 == "prefix" || options.selected.g1 == "suffix")}} prefixOrSuffix =c('{{selected.g1 | safe}}'),{{/if}}{{if (options.selected.enterPrefix !== "")}} prefixOrSuffixString =c("{{selected.enterPrefix | safe}}"),{{/if}}{{if (options.selected.enterSuffix !== "")}} prefixOrSuffixString =c("{{selected.enterSuffix | safe}}"),{{/if}}{{if (options.selected.g1 == "TRUE" )}} NewCol={{selected.g1 | safe}},{{/if}} dontMakeFactor ={{selected.dontMakeFactor | safe}},dataSetNameOrIndex='{{dataset.name}}')
#Refresh the dataset in the data grid
BSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            oldvars: {
                el: new dstVariableList(config, {
                    label: localization.en.oldvars,
                    no: "oldvars",
                    filter: "String|Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            label1: { el: new labelVar(config, { label: localization.en.label1, style: "mt-3",h: 5 }) },
            newvarradio: { el: new radioButton(config, { label: localization.en.newvarradio, no: "g1", increment: "newvarradio", value: "TRUE",  required:true, state: "checked", syntax: "", extraction: "ValueAsIs", dependant_objects: ["newvar"] }) },
            newvar: {
                el: new input(config, {
                    no: 'newvar',
                    label: localization.en.newvar,
                    placeholder: "",
                    extraction: "CreateArray",
                    allow_spaces:true,
                    value: "",
                    ml: 4,
                    type: "character",
                }),
            },
            oldvarradio: { el: new radioButton(config, { label: localization.en.oldvarradio, no: "g1", increment: "oldvarradio", value: "", state: "", syntax: "{{dataset.name}}", extraction: "ValueAsIs" }) },
            suffix: { el: new radioButton(config, { label: localization.en.suffix, no: "g1", increment: "suffix", value: "suffix", state: "", syntax: "", required: true, dependant_objects: ["enterSuffix"], extraction: "ValueAsIs", }) },
            prefix: { el: new radioButton(config, { label: localization.en.prefix, no: "g1", increment: "prefix", value: "prefix", state: "", syntax: "", required: true, dependant_objects: ["enterPrefix"], extraction: "ValueAsIs", }) },
            enterPrefix: {
                el: new input(config, {
                    no: 'enterPrefix',
                    label: localization.en.enterPrefix,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    type: "character"
                }),
            },
            enterSuffix: {
                el: new input(config, {
                    no: 'enterSuffix',
                    label: localization.en.enterSuffix,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    allow_spaces:true,
                    }),
            },
            label3: { el: new labelVar(config, { label: localization.en.label3, h: 6, style: "mt-3" }) },
            label4: { el: new labelVar(config, { label: localization.en.label4, h: 6 }) },
            label5: { el: new labelVar(config, { label: localization.en.label5, h: 6 }) },
            label5a: { el: new labelVar(config, { label: localization.en.label5a, h: 6 }) },
            label5b: { el: new labelVar(config, { label: localization.en.label5b, h: 6 }) },
            label6: { el: new labelVar(config, { label: localization.en.label6, h: 6 }) },
            oldnewvals: {
                el: new input(config, {
                    no: 'oldnewvals',
                    label: localization.en.oldnewvals,
                    placeholder: "",
                    allow_spaces:true,  
                    extraction: "TextAsIs",
                    value: "",
                    required: true,
                    type: "character"
                }),
            },

            dontMakeFactor: { el: new checkbox(config, { label: localization.en.dontMakeFactor, style: "mt-2",no: "dontMakeFactor",
            extraction: "Boolean" }) },

        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.oldvars.el.content, objects.label1.el.content, objects.newvarradio.el.content, objects.newvar.el.content, objects.oldvarradio.el.content, objects.suffix.el.content, objects.enterSuffix.el.content,objects.prefix.el.content, objects.enterPrefix.el.content],
            bottom: [objects.label3.el.content,objects.label4.el.content, objects.label5.el.content,objects.label5a.el.content,objects.label5b.el.content,objects.label6.el.content, objects.oldnewvals.el.content, objects.dontMakeFactor.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-recode",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new recodeVariables().render()