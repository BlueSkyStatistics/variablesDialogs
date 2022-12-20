
var localization = {
    en: {
        title: "Convert To Factor(s)",
        navigation: "To Factor",
        trg: "Variables to be converted to factor",
        help: {
            title: "Convert To Factor(s)",
            r_help: "help(factor, package=base)",
            body: `
<b>Description</b></br>
The function factor is used to encode a vector as a factor (the terms ‘category’ and ‘enumerated type’ are also used for factors). If argument ordered is TRUE, the factor levels are assumed to be ordered. For compatibility with S there is also a function ordered.
is.factor, is.ordered, as.factor and as.ordered are the membership and coercion functions for these classes.
<br/>
<b>Usage</b>
<br/>
<code>
factor(x = character(), levels, labels = levels,
        exclude = NA, ordered = is.ordered(x), nmax = NA)
ordered(x, ...)
is.factor(x)
is.ordered(x)
as.factor(x)
as.ordered(x)
addNA(x, ifany = FALSE)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
x: a vector of data, usually taking a small number of distinct values.
</li>
<li>
levels:	an optional vector of the values (as character strings) that x might have taken. The default is the unique set of values taken by as.character(x), sorted into increasing order of x. Note that this set can be specified as smaller than sort(unique(x)).
</li>
<li>
labels:	Either an optional character vector of labels for the levels (in the same order as levels after removing those in exclude), or a character string of length 1.
</li>
<li>
exclude: A vector of values to be excluded when forming the set of levels. This should be of the same type as x, and will be coerced if necessary.
</li>
<li>
ordered: logical flag to determine if the levels should be regarded as ordered (in the order given).
</li>
<li>
nmax: an upper bound on the number of levels; see ‘Details’.
</li>
<li>
...(in ordered(.)): any of the above, apart from ordered itself.
</li>
<li>
ifany: (only add an NA level if it is used, i.e. if any(is.na(x)).
</li>
</ul>
<b>Details</b></br>
The type of the vector x is not restricted; it only must have an as.character method and be sortable (by sort.list).<br/>
Ordered factors differ from factors only in their class, but methods and the model-fitting functions treat the two classes quite differently.<br/>
The encoding of the vector happens as follows. First all the values in exclude are removed from levels. If x[i] equals levels[j], then the i-th element of the result is j. If no match is found for x[i] in levels (which will happen for excluded values) then the i-th element of the result is set to NA.<br/>
Normally the ‘levels’ used as an attribute of the result are the reduced set of levels after removing those in exclude, but this can be altered by supplying labels. This should either be a set of new labels for the levels, or a character string, in which case the levels are that character string with a sequence number appended.<br/>
factor(x, exclude = NULL) applied to a factor is a no-operation unless there are unused levels: in that case, a factor with the reduced level set is returned. If exclude is used it should also be a factor with the same level set as x or a set of codes for the levels to be excluded.<br/>
The codes of a factor may contain NA. For a numeric x, set exclude = NULL to make NA an extra level (prints as <NA>); by default, this is the last level.<br/>
If NA is a level, the way to set a code to be missing (as opposed to the code of the missing level) is to use is.na on the left-hand-side of an assignment (as in is.na(f)[i] <- TRUE; indexing inside is.na does not work). Under those circumstances missing values are currently printed as <NA>, i.e., identical to entries of level NA.<br/>
is.factor is generic: you can write methods to handle specific classes of objects, see InternalMethods.<br/>
Where levels is not supplied, unique is called. Since factors typically have quite a small number of levels, for large vectors x it is helpful to supply nmax as an upper bound on the number of unique values.<br/>
<b>Value</b><br/>
factor returns an object of class "factor" which has a set of integer codes the length of x with a "levels" attribute of mode character and unique (!anyDuplicated(.)) entries. If argument ordered is true (or ordered() is used) the result has class c("ordered", "factor").<br/>
Applying factor to an ordered or unordered factor returns a factor (of the same type) with just the levels which occur: see also [.factor for a more transparent way to achieve this.
is.factor returns TRUE or FALSE depending on whether its argument is of type factor or not. Correspondingly, is.ordered returns TRUE when its argument is an ordered factor and FALSE otherwise.<br/>
as.factor coerces its argument to a factor. It is an abbreviated form of factor.<br/>
as.ordered(x) returns x if this is ordered, and ordered(x) otherwise.<br/>
addNA modifies a factor by turning NA into an extra level (so that NA values are counted in tables, for instance).<br/>
<b>Package</b></br>
base</br>
<b>Help</b></br>
help(factor, package =fastDummies)
`}
    }
}






class convertToOrdinal extends baseModal {
    constructor() {
        var config = {
            id: "convertToOrdinal",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
#Converts one or more variables to factor variables
BSky.Temp.Obj <- factor ({{selected.vars | safe}}, ordered = TRUE)
`
        }
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            trg: {
                el: new dstVariableList(config, {
                    label: localization.en.trg,
                    no: "trg",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "Prefix|UseComma",
                    required: true
                }), r: ['{{ var | safe}}']
            },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.trg.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-shapes",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
	
	 prepareExecution(instance) {
        var res = [];
        var code_vars = {
            dataset: {
                name: getActiveDataset()
            },
            selected: instance.dialog.extractData()
        }
       let temp =""
		code_vars.selected.trg.forEach((vars) => {
			code_vars.selected.vars =vars
			//const cmd = instance.dialog.renderR(code_vars);
			temp += instance.dialog.renderR(code_vars);
		});
		
		temp = temp + "\n"
		temp = temp + "BSkyLoadRefresh(\"" + code_vars.dataset.name + "\")"
		let cmd = temp
		res.push({ cmd: cmd, cgid: newCommandGroup() })
		return res
        
    }
	
}
module.exports.item = new convertToOrdinal().render()