
var localization = {
    en: {
        title: "Standardize Variable(s)",
        navigation: "Standardize",
        label1: "Standardized values will be saved to new variables with the prefix/suffix specified.",
        dest: "Select the variable(s) to standardize",
        label2: "Select a prefix or suffix",
        suffix: "Suffix",
        prefix: "Prefix",
        txt1: "Enter a prefix/suffix",
        label3: "Center and/or scale",
        Center: "Center",
        Scale: "Scale",
        help: {
            title: "Standardize Variable(s)",
            r_help: "",
            body: `
<b>Description</b></br>
Standardizes variables (z scores).  The standardized values are stored in new variables with either the prefix or suffix of the original variables. The option is provide to center and/or scale.
<br/>
<b>Usage</b>
<br/>
<code> 
BSkyStandardizeVars (vars, center, scale, prefix, datasetname)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
vars: One or more variables to standardize. Only numeric variables (not factors) supported.
</li>
<li>
center:  If center is TRUE then centering is done by subtracting the column means (omitting NAs) of x from their corresponding columns, and if center is FALSE, no centering is done.
</li>
<li>
scale: If scale is TRUE then scaling is done by dividing the (centered) columns of x by their standard deviations if center is TRUE, and the root mean square otherwise. If scale is FALSE, no scaling is done.
</li>
<li>
stingToPrefixOrSuffix:  A character string that specifies the prefixor suffix  to use for the new standardized variables( i.e. new columns in the dataset).
</li>
<li>
prefixOrSuffix: specify if you want a prefix or a suffix
</li>
<li>
datasetname: The dataset/dataframe name
</li>
</ul>
Note: We will not convert from numeric to factor. When  a numeric is recoded, it will remain a numeric, when a factor variable is recoded it will remain a factor.</br>
<b>Package</b></br>
BlueSky</br>
`}
    }
}








class standardizeVariables extends baseModal {
    constructor() {
        var config = {
            id: "standardizeVariables",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
#Standardize the variables
BSkyStandardizeVars(vars=c({{selected.dest | safe}}), center={{selected.Center | safe}}, scale={{selected.Scale | safe}}, stingToPrefixOrSuffix=c("{{selected.txt1 | safe}}"), prefixOrSuffix=c('{{selected.rdgrp1 | safe}}'), datasetname="{{dataset.name}}")
#Refresh the dataset in the data grid
BSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            dest: {
                el: new dstVariableList(config, {
                    label: localization.en.dest,
                    no: "dest",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style: "mt-3",h: 5  }) },
            suffix: { el: new radioButton(config, { label: localization.en.suffix, no: "rdgrp1", increment: "suffix", value: "Suffix", state: "checked", extraction: "ValueAsIs" }) },
            prefix: { el: new radioButton(config, { label: localization.en.prefix, no: "rdgrp1", increment: "prefix", value: "Prefix", state: "", extraction: "ValueAsIs" }) },
            txt1: {
                el: new input(config, {
                    no: 'txt1',
                    label: localization.en.txt1,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    required: true,
                    ml: 4,
                    type: "character"
                }),
            },
            label3: { el: new labelVar(config, { label: localization.en.label3, h: 5, style: "mt-3"  }) },
            Center: { el: new checkbox(config, { label: localization.en.Center, no: "Center", extraction: "Boolean" }) },
            Scale: { el: new checkbox(config, { label: localization.en.Scale, no: "Scale", newline: true, extraction: "Boolean" }) },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.dest.el.content, objects.label2.el.content, objects.suffix.el.content, objects.prefix.el.content, objects.txt1.el.content,objects.label3.el.content, objects.Center.el.content, objects.Scale.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-standardize",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new standardizeVariables().render()