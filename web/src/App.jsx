import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, useFormik } from 'formik';
import * as yup from 'yup';
import "./style.css"

export const App = () => {

  // product fetch and display part
  const [product, setProduct] = useState([]);
  // dependancy variable
  const [loadProduct, getLoadproduct] = useState(false);
  // edit
  const [isEdit, getIsEditing] = useState(false);
  
  const [isEditing, getDoneEditing] = useState({});


  // getting and displaying  product
  let displayProducts = async () => {

    try {
      const response = await axios.get("http://localhost:5001/products")
      setProduct(response.data)
      console.log("response", response.data)
    } catch (error) {
      console.log("Error getting all products :", error)

    }
  }
  useEffect(() => {
    displayProducts()
  }, [loadProduct])

  // delete a product part
  let deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5001/product/${id}`)
      console.log("response", response.data)

      getLoadproduct(!loadProduct)

    } catch (error) {
      console.log("Error getting all products :", error)

    }

  }
  // editing Product
  let editMode = (async (product) => {
    try {
      // const response = await axios.put(`http://localhost:5001/product/${id}`)
      // console.log("response", response.data)
     getIsEditing(!isEdit)
      getDoneEditing(product)

    } catch (error) {
      console.log("Error getting all products :", error)

    }

  })


  // validation part
  const validationSchema = yup.object({
    productName: yup
      .string('Enter your Productname')
      .required('Product name required'),

    productPrice: yup
      .number('Enter your Product Price')
      .required('Price Required')
      .min(0, "Minimum Price would be 1"),

    productDetails: yup
      .string('Enter your Product Details')
      .required('Details are Required')
      .min(10, "Minimum Details would be 10 words")
  });

  const editformik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDetails: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      console.log(values)

      // edited data sending to database part
      axios.put(`http://localhost:5001/product/${values.id}`, {

        name: values.productName,
        price: values.productPrice,
        details: values.productDetails
      })
        .then(response => {
          console.log("response", response.data)
          // we have called the display product function below which enables us to display product immediatly after we all the product which shows post without page reloading
          displayProducts();
          // depedancey array can also be used

          getLoadproduct(!loadProduct)
        })
        .catch(err => {
          console.log("error :", err)
        })

    },
  });


  const formik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDetails: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      console.log(values)

      // data sending to database part
      axios.post(`http://localhost:5001/create`, {

        name: values.productName,
        price: values.productPrice,
        details: values.productDetails
      })
        .then(response => {
          console.log("response", response.data)
          // we have called the display product function below which enables us to display product immediatly after we all the product which shows post without page reloading
          displayProducts();
          // depedancey array can also be used

          getLoadproduct(!loadProduct)
        })
        .catch(err => {
          console.log("error :", err)
        })

    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input

          id="productName"
          name="productName"
          label="productName"
          placeholder='Product Name'

          value={formik.values.productName}
          onChange={formik.handleChange}
          error={formik.touched.productName && (formik.errors.productName)}
        />
        {(formik.touched.productName && (formik.errors.productName) ? <span style={{ color: "red" }}>{formik.errors.productName}</span> : null)}   <br />

        <input

          id="productPrice"
          name="productPrice"
          label="productPrice"
          placeholder='Product Price'


          value={formik.values.productPrice}
          onChange={formik.handleChange}
        />
        {(formik.touched.productPrice && (formik.errors.productPrice) ? <span style={{ color: "red" }}>{formik.errors.productPrice}</span> : null)}
        <br />

        <input

          id="productDetails"
          name="productDetails"
          label="productDetails"
          placeholder='Product Details'

          value={formik.values.productDetails}
          onChange={formik.handleChange}
        />
        {(formik.touched.productDetails && (formik.errors.productDetails) ? <span style={{ color: "red" }}>{formik.errors.productDetails}</span> : null)}
        <br />
        <button variant="contained" type="submit">
          Submit
        </button>
      </form>
      <br />
      <br />

      {/* displaying Product on Homepage */}
      {product.map((eachproduct) => (
        <div key={eachproduct.id} className="display">
          <p>{eachproduct.id}</p>
          <h2>{eachproduct.name}</h2>
          <p>{eachproduct.price}</p>
          <p>{eachproduct.details}</p>
          <button onClick={() => { deleteProduct(eachproduct.id) }}>Delete</button>


          <button onClick={() => { editMode(eachproduct) }}>Edit</button>

          {(editMode && isEditing.id === eachproduct.id) ? 
          
          <div className="edit">

            <form onSubmit={editformik.handleSubmit}>
              <input

                id="productName"
                name="productName"
                label="productName"
                placeholder='Product Name'

                value={editformik.values.productName}
                onChange={editformik.handleChange}
                error={editformik.touched.productName && (editformik.errors.productName)}
              />
               {(editformik.touched.productName && (editformik.errors.productName) ? <span style={{ color: "red" }}>{editformik.errors.productName}</span>
                : null)}   <br />

              <input

                id="productPrice"
                name="productPrice"
                label="productPrice"
                placeholder='Product Price'


                value={formik.values.productPrice}
                onChange={formik.handleChange}
              />
              {(editformik.touched.productPrice && (editformik.errors.productPrice) ? <span style={{ color: "red" }}>{editformik.errors.productPrice}</span> : null)}
              <br />

              <input

                id="productDetails"
                name="productDetails"
                label="productDetails"
                placeholder='Product Details'

                value={editformik.values.productDetails}
                onChange={editformik.handleChange}
              />
              {(editformik.touched.productDetails && (editformik.errors.productDetails) ? <span style={{ color: "red" }}>{editformik.errors.productDetails}</span> : null)}
              <br />
              <button variant="contained" type="submit">
                Submit
              </button>
            </form>
          </div> : null}
        </div>

      ))}
    </div>
  )
}
export default App;
