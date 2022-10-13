
var localization = {
    en: {
        title: "Reorder Factor Levels by Another Variable",
        navigation: "Reorder by Another Variable",
        target: "Select factor variable to re-order",
        variableToOrderBy: "Variable to order by",
        label1: "Reorder factor levels based on an arithmetic function i.e. mean, median, sum of the values in another variable. Select the factor variable to reorder, select a numeric variable to compute the mean, median or sum. This is computed for each level of the factor variable. The levels are then ordered based on this calculation. You can overwrite existing variables or create new variables by specifying a prefix/suffix. New variables will be created with the prefix/suffix appended to existing names.",
        function: "Select a function to order by",
        label2: "Save results to a new variable or overwrite existing variable",
        rd3: "Specify a suffix (A new variable will be created with the suffix) ",
        txt3: "Enter a suffix",
        rd2: "Specify a prefix (A new variable will be created with the prefix) ",
        txt4: "Enter a prefix",
        rd1: "Overwrite existing variable",
        label3: "Specify an order",
        Descending: "Descending",
        Ascending: "Ascending",
        help: {
            title: "Reorder by Another",
            r_help: "help(fct_reorder, package =forcats)",
            body: `
<b>Description</b></br>
Reorder factor levels by sorting along another variable. Factor levels are reordered based on an arithmetic function i.e. mean, median, sum of the values in another variable. Select the factor variable to reorder, select a numeric variable to compute the mean, median or sum. This is computed for each level of the factor variable. The levels are then ordered based on this calculation. The results can be saved into the existing variable(s) or you can create new variables by specifying a prefix/suffix. New variables will be created with the prefix/suffix appended to existing names. 
<br/>
<b>Usage</b>
<br/>
<code> 
fct_reorder(.f, .x, .fun = median, ..., .desc = FALSE)
Dataset1$col1 <-forcats::fct_reorder( .f=Dataset1$col1,.x=Dataset1$col2,.fun=median,.desc=TRUE)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
.f: A factor (or character vector).
</li>
<li>
.x, .y: The levels of f are reordered so that the values of .fun(.x) (for fct_reorder()) and fun(.x, .y) (for fct_reorder2()) are in ascending order.
</li>
<li>
.fun: n summary function. It should take one vector for fct_reorder, and two vectors for fct_reorder2, and return a single value.
</li>
<li>
...: Other arguments passed on to .fun. A common argument is na.rm = TRUE.
</li>
<li>
.desc: Order in descending order? Note the default is different between fct_reorder and fct_reorder2, in order to match the default ordering of factors in the legend.
</li>
</ul>
<b>Examples</b></br>
<code> 
boxplot(Sepal.Width ~ Species, data = iris)<br/>
boxplot(Sepal.Width ~ fct_reorder(Species, Sepal.Width), data = iris)<br/>
boxplot(Sepal.Width ~ fct_reorder(Species, Sepal.Width, .desc = TRUE), data = iris)<br/>
chks <- subset(ChickWeight, as.integer(Chick) < 10)<br/>
chks <- transform(chks, Chick = fct_shuffle(Chick))<br/>
if (require("ggplot2")) {<br/>
ggplot(chks, aes(Time, weight, colour = Chick)) +<br/>
    geom_point() +<br/>
    geom_line()<br/>
# Note that lines match order in legend<br/>
ggplot(chks, aes(Time, weight, colour = fct_reorder2(Chick, Time, weight))) +<br/>
    geom_point() +<br/>
    geom_line() +<br/>
    labs(colour = "Chick")<br/>
}<br/>
</code>
<b>Package</b></br>
forcats</br>
<b>Help</b></br>
Type the line below in the BlueSky Statistics  R syntax editor</br>
help(fct_reorder, package =forcats)
`}
    }
}









class byAnotherVariable extends baseModal {
    constructor() {
        var config = {
            id: "byAnotherVariable",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
## [Reorder by Another Variable]
require(forcats);
{{ if ( options.selected.grp10 =="Overwrite"  ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_reorder( .f={{dataset.name}}\${{selected.target[0] | safe}}, .x={{dataset.name}}\${{selected.variableToOrderBy | safe}},.fun = {{selected.function | safe}},.desc={{selected.specifyOrder | safe}}){{/if}}
{{ if ( options.selected.grp10 =="Prefix"  ) }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_reorder(.f={{dataset.name}}\${{selected.target[0] | safe}},.x={{dataset.name}}\${{selected.variableToOrderBy | safe}},.fun = {{selected.function | safe}},.desc={{selected.specifyOrder | safe}}){{/if}}
{{ if ( options.selected.grp10 =="Suffix" ) }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_reorder(.f={{dataset.name}}\${{selected.target[0] | safe}},.x={{dataset.name}}\${{selected.variableToOrderBy | safe}},.fun = {{selected.function | safe}},.desc={{selected.specifyOrder | safe}}){{/if}}
\nBSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) },
            target: {
                el: new dstVariable(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "Numeric|Ordinal|Nominal",
                    extraction: "Prefix|UseComma",
                    required: true,
                }), r: ['{{ target | safe}}']
            },
            variableToOrderBy: {
                el: new dstVariable(config, {
                    label: localization.en.variableToOrderBy,
                    no: "variableToOrderBy",
                    filter: "Numeric|Date|Scale",
                    extraction: "Prefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            function: {
                el: new comboBox(config, {
                    no: 'function',
                    label: localization.en.function,
                    multiple: false,
                    required: true,
                    extraction: "NoPrefix|UseComma",
                    options: ["mean", "median", "sum", "min", "max",]
                })
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style: "mt-3",h: 5 }) },
            rd3: { el: new radioButton(config, { label: localization.en.rd3, no: "grp10", increment: "rd3", required: true, dependant_objects: ["txt3"], value: "Suffix", state: "checked", extraction: "ValueAsIs", }) },
            txt3: {
                el: new input(config, {
                    no: 'txt3',
                    label: localization.en.txt3,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    type: "character"
                }),
            },
            rd2: { el: new radioButton(config, { label: localization.en.rd2, no: "grp10", increment: "rd2", dependant_objects: ["txt4"], required: true, value: "Prefix", state: "", extraction: "ValueAsIs", }) },
            txt4: {
                el: new input(config, {
                    no: 'txt4',
                    label: localization.en.txt4,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    type: "character"
                }),
            },
            rd1: { el: new radioButton(config, { label: localization.en.rd1, no: "grp10", increment: "rd1", value: "Overwrite", state: "", extraction: "ValueAsIs" }) },
            label3: { el: new labelVar(config, { label: localization.en.label3, style: "mt-3",h: 5 }) },
            Descending: { el: new radioButton(config, { label: localization.en.Descending, no: "specifyOrder", increment: "Descending", value: "TRUE", state: "checked", extraction: "ValueAsIs", }) },
            Ascending: { el: new radioButton(config, { label: localization.en.Ascending, no: "specifyOrder", increment: "Ascending", value: "FALSE", state: "", extraction: "ValueAsIs", }) },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.variableToOrderBy.el.content, objects.function.el.content, objects.label3.el.content, objects.Descending.el.content, objects.Ascending.el.content, objects.label2.el.content, objects.rd3.el.content, objects.txt3.el.content, objects.rd2.el.content, objects.txt4.el.content, objects.rd1.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-reorder_by_one_var",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
    prepareExecution(instance) {
        var res = [];
        var temp = "";
        instance.objects.target.el.getVal().forEach(function (value) {
            var code_vars = {
                dataset: {
                    name: getActiveDataset()
                },
                selected: {
                    target: instance.dialog.prepareSelected({ target: value }, instance.objects.target.r),
                    variableToOrderBy: instance.objects.variableToOrderBy.el.getVal(),
                    function: instance.objects.function.el.getVal(),
                    grp10: common.getCheckedRadio("byAnotherVariable_grp10"),
                    specifyOrder: common.getCheckedRadio("byAnotherVariable_specifyOrder"),
                    txt3: instance.objects.txt3.el.getVal(),
                    txt4: instance.objects.txt4.el.getVal(),
                }
            }
            let cmd = instance.dialog.renderR(code_vars)
            cmd = removenewline(cmd);
            temp = temp + cmd + "\n";
        })
        res.push({ cmd: temp, cgid: newCommandGroup() })
        return res;
    }
}
module.exports.item = new byAnotherVariable().render()