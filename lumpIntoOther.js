
var localization = {
    en: {
        title: "Lump the least or most common factor levels",
        navigation: "Lump into Other (Automatically)",
        target: "Select variables to lump sparse levels for",
        label1: "The  default name of the  new category containing the lumped levels is \"other\". Specifying weights is optional. You can overwrite existing variable(s) with the lumped  levels or save the results to new variable(s)",
        other: "Name for the lumped level",
        label3: "Method to use",
        defaultOption: "Lump together least frequent levels into \"other\" while ensuring that \"other\" is the smallest level",
        categories: "Keep most common (+n)/least common (-n) categories",
        category: "Enter the number of categories",
        proportion1: "Keep categories that appear at least (+ prop)/at most (- prop) proportion of the time",
        proportion: "Enter the proportion",
        dropOption: "Enter levels to replace by \"Other\" for e.g. level1,level2,level3",
        varweights: "Variable weights",
        label2: "Save results to new variable(s) or overwrite existing variable(s)",
        rd3: "Specify a suffix (A new variable will be created with the suffix) ",
        txt3: "Enter a suffix",
        rd2: "Specify a prefix (A new variable will be created with the prefix) ",
        txt4: "Enter a prefix",
        rd1: "Overwrite  existing variables",
        ties: "Options for handling ties",
        help: {
            title: "Lump Into Other",
            r_help: "help(fct_lump, package =forcats)",
            body: `
<b>Description</b></br>
Lump together the least or the most common factor levels into the  "other" level. The  default name of the  new category containing the lumped levels is "other". Specifying weights is optional. You can overwrite existing variable(s) with the lumped  levels or save the results to new variable(s)
<br/>
<b>Usage</b>
<br/>
<code> 
fct_lump(f, n, prop, w = NULL, other_level = "Other",ties.method = c("min", "average", "first", "last", "random", "max"))<br/>
dataset$col1<-fct_lump(f =dataset$col1,w =dataset$col2,other_level ="other",ties.method ="min")
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
f: A factor. If both n and prop are missing, fct_lump lumps together the least frequent levels into "other", while ensuring that "other" is still the smallest level. It's particularly useful in conjunction with fct_inorder().
</li>
<li>
n: Positive n preserves the most common n values. Negative n preserves the least common -n values. It there are ties, you will get at least abs(n) values.
</li>
<li>
prop: Positive prop preserves values that appear at least prop of the time. Negative prop preserves values that appear at most -prop of the time.
</li>
<li>
w:  An optional numeric vector giving weights for frequency of each value (not level) in f.
</li>
<li>
other_level: Value of level used for "other" values. Always placed at end of levels.
</li>
<li>
ties.method: A character string specifying how ties are treated. See rank() for details.
</li>
<li>
min: Preserves values that appear at least min number of times.
</li>
</ul>
<b>Package</b></br>
forcats</br>
<b>Help</b></br>
Type the line below in the BlueSky Statistics  R syntax editor</br>
help(fct_lump, package =forcats)
`}
    }
}










class lumpIntoOther extends baseModal {
    constructor() {
        var config = {
            id: "lumpIntoOther",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
## [Lump into Other]
require(forcats);
{{ if ( options.selected.grp10 =="Overwrite"  ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_lump( f={{dataset.name}}\${{selected.target[0] | safe}}{{if (options.selected.method =="specifyNoCategories")}},n = {{selected.category | safe}}{{/if}}{{if (options.selected.method =="specifyProportion")}},p = {{selected.proportion | safe}}{{/if}}{{selected.varweights | safe}},other_level="{{selected.other | safe}}",ties.method ="{{selected.ties | safe}}"){{/if}}
{{ if ( options.selected.grp10 =="Prefix"  ) }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_lump( f={{dataset.name}}\${{selected.target[0] | safe}}{{if (options.selected.method =="specifyNoCategories")}},n = {{selected.category | safe}}{{/if}}{{if (options.selected.method =="specifyProportion")}},p = {{selected.proportion | safe}}{{/if}}{{selected.varweights | safe}},other_level="{{selected.other | safe}}",ties.method ="{{selected.ties | safe}}"){{/if}}
{{ if ( options.selected.grp10 =="Suffix" ) }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_lump( f={{dataset.name}}\${{selected.target[0] | safe}}{{if (options.selected.method =="specifyNoCategories")}},n = {{selected.category | safe}}{{/if}}{{if (options.selected.method =="specifyProportion")}},p = {{selected.proportion | safe}}{{/if}}{{selected.varweights | safe}},other_level="{{selected.other | safe}}",ties.method ="{{selected.ties | safe}}"){{/if}}
\nBSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) },
            target: {
                el: new dstVariableList(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "Numeric|Logical|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ target | safe}}']
            },
            other: {
                el: new input(config, {
                    no: 'other',
                    label: localization.en.other,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "other",
                    required: true,
                    allow_spaces:true,
                    type: "character",
                }),
            },
            label3: { el: new labelVar(config, { label: localization.en.label3, style: "mt-3",h: 5 }) },
            defaultOption: { el: new radioButton(config, { label: localization.en.defaultOption, no: "method", increment: "defaultOption", value: "defaultOption", state: "checked", extraction: "ValueAsIs" }) },
            categories: { el: new radioButton(config, { label: localization.en.categories, no: "method", increment: "categories", value: "specifyNoCategories", state: "", extraction: "ValueAsIs", dependant_objects: ["category"] }) },
            category: {
                el: new inputSpinner(config, {
                    no: "category",
                    label: localization.en.category,
                    ml: 4,
                    min: -10000000,
                    max: 10000000,
                    step: 1,
                    value: 0,
                    extraction: "NoPrefix|UseComma"
                })
            },
            proportion1: { el: new radioButton(config, { label: localization.en.proportion1, no: "method", increment: "proportion1", value: "specifyProportion", state: "", extraction: "ValueAsIs", dependant_objects: ["proportion"] }) },
            proportion: {
                el: new inputSpinner(config, {
                    no: "proportion",
                    label: localization.en.proportion,
                    ml: 4,
                    min: -1,
                    max: 1,
                    step: 0.1,
                    value: 0.1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            varweights: {
                el: new dstVariable(config, {
                    label: localization.en.varweights,
                    no: "varweights",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    //required:true,
                }), r: [', w={{varweights|safe}}']
            },
            ties: {
                el: new comboBox(config, {
                    no: 'ties',
                    label: localization.en.ties,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["first", "min", "average", "last", "random", "max"],
                    default: "min"
                })
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style: "mt-3",h: 5 }) },
            rd3: { el: new radioButton(config, { label: localization.en.rd3, no: "grp10", required: true, dependant_objects: ["txt3"], increment: "rd3", value: "Suffix", state: "checked", extraction: "ValueAsIs", }) },
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
            rd2: { el: new radioButton(config, { label: localization.en.rd2, no: "grp10", required: true, dependant_objects: ["txt4"], increment: "rd2", value: "Prefix", state: "", extraction: "ValueAsIs", }) },
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
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.other.el.content, objects.label3.el.content, objects.defaultOption.el.content, objects.categories.el.content, objects.category.el.content, objects.proportion1.el.content, objects.proportion.el.content, objects.varweights.el.content, objects.ties.el.content, objects.label2.el.content, objects.rd3.el.content, objects.txt3.el.content, objects.rd2.el.content, objects.txt4.el.content, objects.rd1.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-combine",
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
                    varweights: instance.dialog.prepareSelected({ varweights: instance.objects.varweights.el.getVal()[0] }, instance.objects.varweights.r),
                    grp10: common.getCheckedRadio("lumpIntoOther_grp10"),
                    method: common.getCheckedRadio("lumpIntoOther_method"),
                    category: instance.objects.category.el.getVal(),
                    proportion: instance.objects.proportion.el.getVal(),
                    other: instance.objects.other.el.getVal(),
                    ties: instance.objects.ties.el.getVal(),
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
module.exports.item = new lumpIntoOther().render()