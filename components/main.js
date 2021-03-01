import * as _ from "lodash";
import * as flat from "flat";

import { useState } from "react";
import { Button, Typography } from "@material-ui/core";

//dummy test data
let o1 = {
  "Aidan Gillen": {
    array: ['Game of Thron"es', "The Wire"],
    string: "some string",
    int: 2,
    aboolean: true,
    boolean: true,
    object: {
      foo: "bar",
      object1: { "new prop1": "new prop value" },
      object2: { "new prop1": "new prop value" },
      object3: { "new prop1": "new prop value" },
      object4: { "new prop1": "new prop value" },
    },
  },
  "Amy Ryan": { one: "In Treatment", two: "The Wire" },
  "Annie Fitzgerald": ["Big Love", "True Blood"],
  "Anwan Glover": ["Treme", "The Wire"],
  "Alexander Skarsgard": ["Generation Kill", "True Blood"],
  "Clarke Peters": null,
};

let o2 = {
  "Aidan Gillen": {
    array: ["Game of Thrones", "The Wire"],
    string: "some string",
    int: "2",
    otherint: 4,
    aboolean: "true",
    boolean: false,
    object: { foo: "bar" },
  },
  "Amy Ryan": ["In Treatment", "The Wire"],
  "Annie Fitzgerald": ["True Blood", "Big Love", "The Sopranos", "Oz"],
  "Anwan Glover": ["Treme", "The Wire"],
  "Alexander Skarsg?rd": ["Generation Kill", "True Blood"],
  "Alice Farmer": ["The Corner", "Oz", "The Wire"],
};
const delimiter = ".";
const defaultLeft = JSON.stringify(o1, null, "  ");
const defaultRight = JSON.stringify(o2, null, "  ");
const defaultMessage = "Enter JSON to compare";

const flexStyle = {
  display: "flex",
  width: "100%",
  height: "100%",
  padding: "10px",
};
const textAreaStyle = {
  flex: 1,
  margin: "30px",
  resize: "none"
};

const isJson = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

const highlight = (color,item,path) => {
  return `<span class='difference' style='color:${color}' title='${path}'>${item}</span>`
}

const createPathWithoutDelimiter = (delimiter,path) => {
  return path
  return path.replace(new RegExp(delimiter,"g"),".")
  
}

export default function main() {
  const [showEditor, setShowEditor] = useState(true);

  const [message, setMessage] = useState(defaultMessage);

  const [inputs, setInputs] = useState({
    left: defaultLeft,
    right: defaultRight,
  });

  const [outputs, setOutputs] = useState({});

  const submissionHandler = (e) => {
    e.preventDefault();

    if (isJson(inputs.left) && isJson(inputs.right)) {
      const left = JSON.parse(inputs.left);
      const right = JSON.parse(inputs.right);

      const result = differenceCalculator(left, right);

      if (result.equal) {
        setMessage("Both the JSONs are semantically identical.");
        setShowEditor(false);
        setOutputs({
          left,
          right,
        });
      } else {
        if (result.message) {
          setMessage(result.message);
          setShowEditor(true);
        } else {
          let uniqResults = _.uniqBy(result.diff, (i) => i.key);
          setMessage(`There are ${uniqResults.length} differences found`);
          let colouredLeft = { ...left };
          let colouredRight = { ...right };

          for (let item of result.diff) {
            if (item.onLeft) {
              // set the color for the mismatched value
              _.set(
                colouredLeft,
                item.key,
                // `<span style='color:red'>${_.get(left, item.key)}</span>`
                highlight("red",_.get(left, item.key),item.key)
              );

              // let splitPath = item.key.split(delimiter)

              // let longList = []

              // for( let i = 0 ; i < splitPath.length ; i++ ){
              //     let local = []
              //     for( let j = 0 ; j <=i;j++  ){
              //         local.push(splitPath[j])
              //     }
              //     longList.push(local)
              // }

              // longList = longList.map(i=>i.join(delimiter))
              // console.log(`longList : ${JSON.stringify(longList)}`)

              // // color keys
              // for(let path of longList){
              //   _.set(
              //     colouredLeft,
              //     path,
              //     `<span style='color:red'>${_.get(left,(path))}</span>`
              //   )
              // }
            }

            if (item.onRight) {
              // set the color for the mismatched value
              _.set(
                colouredRight,
                item.key,
                // `<span style='color:green'>${_.get(right, item.key)}</span>`
                highlight("green",_.get(right, item.key),item.key)
              );

              // let splitPath = item.key.split(delimiter)

              // let longList = []

              // for( let i = 0 ; i < splitPath.length ; i++ ){
              //     let local = []
              //     for( let j = 0 ; j <=i;j++  ){
              //         local.push(splitPath[j])
              //     }
              //     longList.push(local)
              // }

              // longList = longList.map(i=>i.join(delimiter))
              // console.log(`longList : ${JSON.stringify(longList)}`)

              // // color keys
              // for(let path of longList){
              //   _.set(
              //     colouredRight,
              //     path,
              //     `<span style='color:red'>${_.get(right,(path))}</span>`
              //   )
              // }
            }
          }

          setOutputs({
            left: colouredLeft,
            right: colouredRight,
          });

          setShowEditor(false);
        }
      }
    } else {
      setMessage("Unable to parse as JSON. Expecting an array or object.");
      setShowEditor(true);
    }
  };

  const jsonChangeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const differenceCalculator = (left, right) => {
    let result = {
      equal: false,
      diff: [],
      message: "",
    };

    if (_.isEqual(left, right) === true) {
      result.equal = true;
    } else if (
      !(
        ((inputs.left.includes("{") && inputs.left.includes("}")) ||
          (inputs.left.includes("[") && inputs.left.includes("]"))) &&
        ((inputs.right.includes("{") && inputs.right.includes("}")) ||
          (inputs.right.includes("[") && inputs.right.includes("]")))
      )
    ) {
      result.message = `Parse error due to input. Expecting an array or object.`;
      return result;
    } else {
      const f1 = flat(left, { delimiter });
      const f2 = flat(right, { delimiter });

      console.log("f1",JSON.stringify(f1))
      console.log("f2",JSON.stringify(f2))

      let arrayWithDiffs = [];

      for (let l1 in f1) {
        l1 = createPathWithoutDelimiter(delimiter,l1)
        console.log("l1",l1)
        const diff = _.isEqual(_.get(f1, l1), _.get(f2, l1));
        if (!diff) {
          arrayWithDiffs.push({
            onLeft: true,
            onRight: false,
            key: l1,
          });
        }
      }

      for (let r1 in f2) {
        r1 = createPathWithoutDelimiter(delimiter,r1)
        console.log("r1",r1)
        const diff = _.isEqual(_.get(f2, r1), _.get(f1, r1));
        if (!diff) {
          arrayWithDiffs.push({
            onLeft: false,
            onRight: true,
            key: r1,
          });
        }
      }

      result.diff = arrayWithDiffs;
    }

    return result;
  };

  return (
    <>
      <Typography variant="body1" component="body1">
        {message}
      </Typography>
      {showEditor && (
        <div className="container" id="ip">
          <form style={flexStyle} onSubmit={submissionHandler}>
            <textarea
              required
              name="left"
              id="left"
              cols="30"
              rows="32"
              style={textAreaStyle}
              onChange={jsonChangeHandler}
              value={inputs.left}
            ></textarea>
            <div style={{ ...textAreaStyle, flex: 0.25 }}>
              <Button variant="contained" type="submit" id="compare">
                Compare
              </Button>
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  setInputs({ left: "", right: "" });
                  setOutputs({ left: "", right: "" });
                  setMessage(defaultMessage);
                }}
              >
                Clear
              </Button>
            </div>
            <textarea
              required
              name="right"
              id="right"
              cols="30"
              rows="32"
              style={textAreaStyle}
              onChange={jsonChangeHandler}
              value={inputs.right}
            ></textarea>
          </form>
        </div>
      )}
      {!showEditor && (
        <div className="container" id="op" style={flexStyle}>
          <div
            id="leftOp"
            style={{ ...textAreaStyle, border: "solid", overflowY:"auto", height:"512px" }}
            dangerouslySetInnerHTML={{
              __html: `<pre></div>${
                JSON.stringify(outputs.left, null, "  ") || ""
              }</div></pre>`,
            }}
          ></div>

          <div style={{ ...textAreaStyle, flex: 0.25 }}>
            <Button
              variant="contained"
              onClick={(e) => setShowEditor(true)}
              id="edit"
            >
              Edit
            </Button>
            <br />
            <Button
              variant="contained"
              onClick={() => {
                setInputs({ left: "", right: "" });
                setOutputs({ left: "", right: "" });
                setMessage(defaultMessage);
                setShowEditor(true);
              }}
            >
              Clear
            </Button>
          </div>
          <div
            id="rightOp"
            style={{ ...textAreaStyle, border: "solid", overflowY:"auto", height:"512px" }}
            dangerouslySetInnerHTML={{
              __html: `<pre></div>${
                JSON.stringify(outputs.right, null, "  ") || ""
              }</div></pre>`,
            }}
          ></div>
        </div>
      )}
    </>
  );
}
