import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useState } from "react";

interface dynamicObject {
  [key: string]: any;
  // | number | object | string[] | number[] | object[];
}

export interface inputProps {
  name: string;
  label: string;
  required?: boolean;
  fullWidth?: boolean;
  type?: string;
  defaultValue?: any;
  onChange?: any;
  lowEnd?: number;
  highEnd?: number;
  options?: string[];
  inputs?: inputProps[];
  render?: Function;
  total?: boolean;
  unit?: string;
}

interface props {
  inputs: inputProps[];
  onSubmit: (x: any) => void;
}

const Form = ({ inputs, onSubmit }: props) => {
  const [formValues, setFormValues] = useState<dynamicObject>(
    inputs.reduce(
      (final, { defaultValue, type, name }) => ({
        ...final,
        [name]: defaultValue
          ? defaultValue
          : type === "date"
          ? moment().format("yyyy-MM-DD")
          : type === "time"
          ? moment().format("HH:mm")
          : undefined,
      }),
      {}
    )
  );

  return (
    <form
      className="my-4 row"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formValues);
      }}
    >
      {inputs.map(
        (
          {
            name,
            label,
            type,
            options,
            inputs,
            required,
            defaultValue,
            onChange,
            fullWidth,
            ...rest
          },
          i
        ) => (
          <div className={fullWidth ? "col-12" : "col-md-6 col-lg-4"} key={i}>
            <label className="form-label text-start w-100 mt-4">
              {label}
              {required ? <span className="ms-1 text-danger"> *</span> : ""}
            </label>

            {type === "select" ? (
              <select
                name={name}
                className="form-control"
                value={formValues[name]}
                onChange={(e) =>
                  onChange
                    ? onChange(e, setFormValues)
                    : setFormValues((current) => ({
                        ...current,
                        [name]: e.target.value,
                      }))
                }
                required={required}
                {...rest}
              >
                <option>Please Choose...</option>

                {options?.map((option, x) => (
                  <option value={option} key={x}>
                    {option}
                  </option>
                ))}
              </select>
            ) : type === "dynamicList" ? (
              <table className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    {inputs?.map((input, x) => (
                      <th key={x}>
                        {input.label}
                        {input.required ? (
                          <span className="ms-1 text-danger"> *</span>
                        ) : (
                          ""
                        )}
                      </th>
                    ))}

                    <th
                      role="button"
                      onClick={() =>
                        setFormValues((current) => ({
                          ...current,
                          [name]: formValues[name]
                            ? [...formValues[name], {}]
                            : [{}],
                        }))
                      }
                      className="text-success"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {formValues[name]?.map((value: dynamicObject, x = 0) => (
                    <tr key={x}>
                      {inputs?.map((input, y) => (
                        <td key={y}>
                          <input
                            {...input}
                            name={input.name}
                            value={value[input.name]}
                            onChange={(e) =>
                              onChange
                                ? onChange(e, setFormValues)
                                : setFormValues((current) => ({
                                    ...current,
                                    [name]: current[name].map(
                                      (ele = {}, z = 0) =>
                                        z === x
                                          ? {
                                              ...ele,
                                              [input.name]: e.target.value,
                                            }
                                          : ele
                                    ),
                                  }))
                            }
                            required={input.required}
                            className="form-control"
                          />
                        </td>
                      ))}

                      <td
                        role="button"
                        onClick={() =>
                          setFormValues((current) => ({
                            ...current,
                            [name]: current[name].filter(
                              (_ = {}, z = 0) => z !== x
                            ),
                          }))
                        }
                        className="text-danger"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <input
                name={name}
                type={type}
                value={formValues[name]}
                onChange={(e) =>
                  onChange
                    ? onChange(e, setFormValues)
                    : setFormValues((current) => ({
                        ...current,
                        [name]: e.target.value,
                      }))
                }
                className="form-control"
                required={required}
                {...rest}
              />
            )}
          </div>
        )
      )}

      <div className="col-xs-12">
        <button className="btn btn-secondary my-4 p-3 w-100" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
