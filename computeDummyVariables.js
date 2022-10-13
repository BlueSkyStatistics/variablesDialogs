
var localization = {
    en: {
        title: "Compute Dummy Variable(s)",
        navigation: "Dummy Code",
        label1: "Enter variables to be dummy coded. New variables are created with the name in the format \"variable name_level name\".  By default the most frequent level is treated as reference",
        target: "Select the variable(s) to be dummied",
        label2: "Level to treat as reference",
        MostFrequent: "Most frequent value",
        first: "First value",
        None: "Keep all levels (not recommended for statistical models) A.k.a one hot encoding",
        prefix: "Prefix",
        txt1: "Enter a prefix/suffix",
        label3: "Other options",
        chk3: "Remove original variables",
        chk4: "Create dummy variables for missing values",
        help: {
            title: "Compute Dummy Variable(s)",
            r_help: "help(dummy_cols, package =fastDummies)",
            body: `
<b>Description</b></br>
Compute Dummy Variables
<br/>
<b>Usage</b>
<br/>
<code>
dummy_cols(.data, select_columns = NULL, remove_first_dummy = FALSE,
    remove_most_frequent_dummy = FALSE, ignore_na = FALSE,
    split = NULL, remove_selected_columns = FALSE)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
.data:	An object with the data set you want to make dummy columns from.
</li>
<li>
select_columns:	Vector of column names that you want to create dummy variables from. If NULL (default), uses all character and factor columns.
</li>
<li>
remove_first_dummy: Removes the first dummy of every variable such that only n-1 dummies remain. This avoids multicollinearity issues in models.
</li>
<li>
remove_most_frequent_dummy: Removes the most frequently observed category such that only n-1 dummies remain. If there is a tie for most frequent, will remove the first (by alphabetical order) category that is tied for most frequent.
</li>
<li>
ignore_na: If TRUE, ignores any NA values in the column. If FALSE (default), then it will make a dummy column for value_NA and give a 1 in any row which has a NA value.
</li>
<li>
split: A string to split a column when multiple categories are in the cell. For example, if a variable is Pets and the rows are "cat", "dog", and "turtle", each of these pets would become its own dummy column. If one row is "cat, dog", then a split value of "," this row would have a value of 1 for both the cat and dog dummy columns.
</li>
<li>
remove_selected_columns: If TRUE (not default), removes the columns used to generate the dummy columns.
</li>
<li>
Value: A data.frame (or tibble or data.table, depending on input data type) with same number of rows as inputted data and original columns plus the newly created dummy columns.
</li>
<li>
See Also
dummy_rows For creating dummy rows
</li>
<li>
Other dummy functions: dummy_columns, dummy_rows
</li>
</ul>
<b>Examples</b><br/>
<code> 
crime <- data.frame(city = c("SF", "SF", "NYC"),
    year = c(1990, 2000, 1990),
    crime = 1:3)</br>
dummy_cols(crime)</br>
# Include year column
dummy_cols(crime, select_columns = c("city", "year"))</br>
# Remove first dummy for each pair of dummy columns made</br>
dummy_cols(crime, select_columns = c("city", "year"),
    remove_first_dummy = TRUE)</br>
</code> <br/>
<b>Package</b></br>
fastDummies</br>
<b>Help</b></br>
help(dummy_cols, package =fastDummies)
`}
    }
}








class computeDummyVariables extends baseModal {
    constructor() {
        var config = {
            id: "computeDummyVariables",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(fastDummies)
#Dummy coding variables
{{dataset.name}} <- fastDummies::dummy_cols(.data ={{dataset.name}}, select_columns = c({{selected.target | safe}}), {{selected.rdgrp | safe}}{{selected.chk3 | safe}},{{selected.chk4 | safe}} )
#Replacing blanks in the new columns for dummy variables with _ as modeling building
#and other functions don't work with blanks in variable names
#This is because blank characters are common in factor level names, think a level called "Returning customer" or "Home schooling"
names({{dataset.name}} ) <- stringr::str_replace_all(names({{dataset.name}} ) , pattern=" ", replacement="_")
BSkyLoadRefresh(bskyDatasetName="{{dataset.name}}" ,load.dataframe=TRUE)
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            target: {
                el: new dstVariableList(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, h: 5 }) },
            MostFrequent: { el: new radioButton(config, { label: localization.en.MostFrequent, no: "rdgrp", increment: "MostFrequent", value: "remove_most_frequent_dummy = TRUE,", state: "checked", extraction: "ValueAsIs" }) },
            first: { el: new radioButton(config, { label: localization.en.first, no: "rdgrp", increment: "first", value: "remove_first_dummy = TRUE,", state: "", extraction: "ValueAsIs", }) },
            None: { el: new radioButton(config, { label: localization.en.None, no: "rdgrp", increment: "None", value: "", state: "", extraction: "ValueAsIs", }) },
            label3: { el: new labelVar(config, { label: localization.en.label3, h: 5,style: "mt-2", }) },
            chk3: {
                el: new checkbox(config, {
                    label: localization.en.chk3,
                    no: "chk3",
                    bs_type: "valuebox",
                    newline:true,
                    extraction: "BooleanValue",
                    true_value: "remove_selected_columns = TRUE",
                    false_value: "remove_selected_columns = FALSE",
                })
            },
            chk4: {
                el: new checkbox(config, {
                    label: localization.en.chk4,
                    no: "chk4",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "ignore_na = FALSE",
                    false_value: "ignore_na = TRUE",
                })
            },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.label2.el.content, objects.MostFrequent.el.content, objects.first.el.content, objects.None.el.content, objects.label3.el.content, objects.chk3.el.content, objects.chk4.el.content,],
            nav: {
                name: localization.en.navigation,
                icon: "icon-dummies",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new computeDummyVariables().render()