
var localization = {
    en: {
        title: "Display Levels",
        navigation: "Display",
        target: "Factor variables to display levels for",
        help: {
            title: "Display Levels",
            r_help: "help(map,package=purrr)",
            body: `
<b>Description</b></br>
Applies the levels function in base to the selected variables in the dataset. Users the select function in dplyr to pipe the variables to the map function that applies the levels function to each variable
<br/>
<b>Usage</b>
<br/>
<code> 
Dataset %>%
    dplyr::select(var1,var2) %>%
    purrr::map(levels)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
var1,var2: Variables in the dataset to display levels for
</li>
<li>
Dataset: The dataset that contains the variable var1, var2
</li>
</ul>
<b>Value</b><br/>
The levels of the selected variables are displayed<br/>
<b>Package</b></br>
purrr, dplyr</br>
<b>Help</b></br>
help(map,package=purrr)
`}
    }
}






class displayLevels extends baseModal {
    constructor() {
        var config = {
            id: "displayLevels",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(tidyverse)
require(dplyr)
{{dataset.name}} %>%\n\tdplyr::select({{selected.target | safe}}) %>%\n\tpurrr::map(levels) 
`
        }
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            target: {
                el: new dstVariableList(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "Numeric|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true
                }), r: ['{{ var | safe}}']
            },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.target.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-eye_white_comp",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new displayLevels().render()