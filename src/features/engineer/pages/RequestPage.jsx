// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   Box,
//   Divider,
//   CircularProgress,
//   Alert,
// } from "@mui/material";

// const RequestPage = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     name: "",
//     status: "Requested",
//     partId: "",
//     vendor: "",
//     srNumber: "",
//     fieldServiceTaskNumber: "",
//     faultPartNumber: "",
//     mailIds: "",
//     customer: "",
//     requestedUserId: "",
//     description: "",
//     createdAt: "",
//     updatedAt: "",
//   });

//   const [vendors, setVendors] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const loggedInUsername = localStorage.getItem("username") || "UnknownUser";
//   const token = localStorage.getItem("token"); // JWT token for Authorization header

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const [vendorRes, customerRes] = await Promise.all([
//           fetch("http://localhost:8080/api/vendors"),
//           fetch("http://localhost:8080/api/customers"),
//         ]);

//         if (!vendorRes.ok || !customerRes.ok) {
//           throw new Error("Failed to load vendors or customers.");
//         }

//         const [vendorData, customerData] = await Promise.all([
//           vendorRes.json(),
//           customerRes.json(),
//         ]);

//         setVendors(vendorData);
//         setCustomers(customerData);

//         if (!id) {
//           setFormData((prev) => ({
//             ...prev,
//             vendor: vendorData.length > 0 ? vendorData[0].id : "",
//             customer: customerData.length > 0 ? customerData[0].id : "",
//           }));
//         }

//         if (id) {
//           const requestRes = await fetch(`http://localhost:8080/api/requests/${id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`, // Add token if needed here too
//             },
//           });
//           if (!requestRes.ok) throw new Error("Failed to load request details.");
//           const requestData = await requestRes.json();

//           setFormData({
//             ...requestData,
//             vendor: requestData.vendor?.id || "",
//             customer: requestData.customer?.id || "",
//             requestedUserId: requestData.requestedUserId || "",
//           });
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message || "Error fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, token]); // add token dependency for safe reload

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: ["vendor", "customer", "requestedUserId"].includes(name)
//         ? Number(value)
//         : value,
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.name.trim() || !formData.vendor || !formData.customer) {
//       return "Name, Vendor, and Customer are required.";
//     }
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     const requestBody = {
//       ...formData,
//       vendor: { id: Number(formData.vendor) },
//       customer: { id: Number(formData.customer) },
//       requestedUserId: formData.requestedUserId
//         ? Number(formData.requestedUserId)
//         : null,
//       updatedAt: new Date().toISOString(),
//     };

//     if (!id) requestBody.createdAt = new Date().toISOString();

//     try {
//       const url = id
//         ? `http://localhost:8080/api/requests/${id}`
//         : "http://localhost:8080/api/requests";
//       const method = id ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Add token header
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (response.ok) {
//         if (!id) {
//           await sendNotification(loggedInUsername);
//         }

//         alert("Request submitted successfully!");
//         navigate(-1);
//       } else {
//         const errorText = await response.text();
//         try {
//           const errorData = JSON.parse(errorText);
//           setError(errorData.message || "Failed to submit request.");
//         } catch {
//           setError(errorText || "Failed to submit request. Please try again.");
//         }
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       setError("An error occurred while submitting the request.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const sendNotification = async (username) => {
//     try {
//       const params = new URLSearchParams({
//         recipient: "supplychain",
//         message: `New part request submitted by ${username}`,
//         type: "info",
//       });

//       const notifyResponse = await fetch(
//         `http://localhost:8080/api/notifications/send?${params.toString()}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Add token header
//           },
//           body: null,
//         }
//       );

//       if (!notifyResponse.ok) {
//         let errorText = "Notification failed.";
//         try {
//           const body = await notifyResponse.text();
//           if (body) errorText = body;
//         } catch (e) {
//           console.warn("Could not parse error response:", e);
//         }
//         console.error("Notification error:", errorText);
//       } else {
//         console.log("Notification sent successfully.");
//       }
//     } catch (err) {
//       console.error("Notification error (network/server):", err.message);
//     }
//   };

//   return (
//     <Container
//       maxWidth="md"
//       sx={{
//         mt: 3,
//         p: 2,
//         bgcolor: "#FFFBFB",
//         borderRadius: 2,
//         boxShadow: 2,
//         border: "1px solid #ECE7E7",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           bgcolor: "#ECE7E7",
//           p: 1.5,
//           borderRadius: "8px 8px 0 0",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
//           {id ? "Edit Request" : "Add New Request"}
//         </Typography>
//         <Button
//           onClick={() => navigate(-1)}
//           variant="contained"
//           size="small"
//           sx={{
//             bgcolor: "#2715E6",
//             color: "#FFFFFF",
//             fontWeight: 500,
//             textTransform: "none",
//             "&:hover": { bgcolor: "#1F10C8" },
//           }}
//         >
//           ← Back
//         </Button>
//       </Box>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {error && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {error}
//             </Alert>
//           )}

//           <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//             <Box sx={{ flex: 1 }}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//                 required
//               />
//               <TextField
//                 fullWidth
//                 select
//                 size="small"
//                 label="Status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//               >
//                 {[
//                   "Requested",
//                   "Approved",
//                   "Rejected",
//                   "In Progress",
//                   "Completed",
//                 ].map((status) => (
//                   <MenuItem key={status} value={status}>
//                     {status}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 fullWidth
//                 select
//                 size="small"
//                 label="Vendor"
//                 name="vendor"
//                 value={formData.vendor}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//                 required
//               >
//                 {vendors.map((vendor) => (
//                   <MenuItem key={vendor.id} value={vendor.id}>
//                     {vendor.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 fullWidth
//                 select
//                 size="small"
//                 label="Customer"
//                 name="customer"
//                 value={formData.customer}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//                 required
//               >
//                 {customers.map((customer) => (
//                   <MenuItem key={customer.id} value={customer.id}>
//                     {customer.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="SR Number"
//                 name="srNumber"
//                 value={formData.srNumber}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//               />
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Field Service Task Number"
//                 name="fieldServiceTaskNumber"
//                 value={formData.fieldServiceTaskNumber}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//               />
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Fault Part Number"
//                 name="faultPartNumber"
//                 value={formData.faultPartNumber}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//               />
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Email ID"
//                 name="mailIds"
//                 value={formData.mailIds}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//               />
//               <TextField
//                 fullWidth
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 sx={{ mb: 1.5 }}
//               />
//             </Box>

//             <Divider orientation="vertical" flexItem sx={{ backgroundColor: "#E0E0E0" }} />

//             <Box sx={{ flex: 0.4 }}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Part Number"
//                 name="partId"
//                 value={formData.partId}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{ mb: 1.5 }}
//               />
//             </Box>
//           </Box>

//           <Button
//             type="submit"
//             variant="contained"
//             sx={{ mt: 2, width: "100%" }}
//             disabled={submitting}
//           >
//             {submitting
//               ? id
//                 ? "Updating..."
//                 : "Submitting..."
//               : id
//               ? "Update Request"
//               : "Request Part"}
//           </Button>
//         </form>
//       )}
//     </Container>
//   );
// };

// export default RequestPage;
// src/pages/RequestPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

const RequestPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const loggedInUsername = localStorage.getItem("username") || "UnknownUser";

  const [formData, setFormData] = useState({
    name: "",
    status: "Requested",
    partId: "",
    vendor: "",
    srNumber: "",
    fieldServiceTaskNumber: "",
    faultPartNumber: "",
    mailIds: "",
    customer: "",
    requestedUserId: "",
    description: "",
    createdAt: "",
    updatedAt: "",
  });

  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [vendorRes, customerRes] = await Promise.all([
          fetch("http://localhost:8080/api/vendors"),
          fetch("http://localhost:8080/api/customers"),
        ]);

        if (!vendorRes.ok || !customerRes.ok) {
          throw new Error("Failed to load vendor or customer data.");
        }

        const [vendorData, customerData] = await Promise.all([
          vendorRes.json(),
          customerRes.json(),
        ]);

        setVendors(vendorData);
        setCustomers(customerData);

        if (!id) {
          setFormData((prev) => ({
            ...prev,
            vendor: vendorData[0]?.id || "",
            customer: customerData[0]?.id || "",
          }));
        }

        if (id) {
          const requestRes = await fetch(`http://localhost:8080/api/requests/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!requestRes.ok) throw new Error("Failed to load request details.");

          const requestData = await requestRes.json();

          setFormData({
            ...requestData,
            vendor: requestData.vendor?.id || "",
            customer: requestData.customer?.id || "",
            requestedUserId: requestData.requestedUserId || "",
          });
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["vendor", "customer", "requestedUserId"].includes(name)
      ? Number(value)
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.vendor || !formData.customer) {
      return "Name, Vendor, and Customer are required.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const requestBody = {
      ...formData,
      vendor: { id: Number(formData.vendor) },
      customer: { id: Number(formData.customer) },
      requestedUserId: formData.requestedUserId
        ? Number(formData.requestedUserId)
        : null,
      updatedAt: new Date().toISOString(),
    };

    if (!id) requestBody.createdAt = new Date().toISOString();

    const url = id
      ? `http://localhost:8080/api/requests/${id}`
      : "http://localhost:8080/api/requests";

    try {
      const res = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        alert("Request submitted successfully!");
        navigate(-1);
      } else {
        const text = await res.text();
        try {
          const errData = JSON.parse(text);
          setError(errData.message || "Failed to submit request.");
        } catch {
          setError(text || "Failed to submit request.");
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, p: 2, bgcolor: "#FFFBFB", borderRadius: 2, boxShadow: 2, border: "1px solid #ECE7E7" }}>
      <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#ECE7E7", p: 1.5, borderRadius: "8px 8px 0 0", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
          {id ? "Edit Request" : "Add New Request"}
        </Typography>
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#2715E6",
            color: "#fff",
            textTransform: "none",
            "&:hover": { bgcolor: "#1F10C8" },
          }}
        >
          ← Back
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField fullWidth size="small" label="Name" name="name" value={formData.name} onChange={handleChange} required sx={{ mb: 1.5 }} />
              <TextField fullWidth select size="small" label="Status" name="status" value={formData.status} onChange={handleChange} sx={{ mb: 1.5 }}>
                {["Requested", "Approved", "Rejected", "In Progress", "Completed"].map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth select size="small" label="Vendor" name="vendor" value={formData.vendor} onChange={handleChange} required sx={{ mb: 1.5 }}>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth select size="small" label="Customer" name="customer" value={formData.customer} onChange={handleChange} required sx={{ mb: 1.5 }}>
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth size="small" label="SR Number" name="srNumber" value={formData.srNumber} onChange={handleChange} sx={{ mb: 1.5 }} />
              <TextField fullWidth size="small" label="Field Service Task Number" name="fieldServiceTaskNumber" value={formData.fieldServiceTaskNumber} onChange={handleChange} sx={{ mb: 1.5 }} />
              <TextField fullWidth size="small" label="Fault Part Number" name="faultPartNumber" value={formData.faultPartNumber} onChange={handleChange} sx={{ mb: 1.5 }} />
              <TextField fullWidth size="small" label="Email ID" name="mailIds" value={formData.mailIds} onChange={handleChange} sx={{ mb: 1.5 }} />
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} sx={{ mb: 1.5 }} />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ backgroundColor: "#E0E0E0" }} />

            <Box sx={{ flex: 0.4 }}>
              <TextField fullWidth size="small" label="Part Number" name="partId" value={formData.partId} onChange={handleChange} sx={{ mb: 1.5 }} />
            </Box>
          </Box>

          <Button type="submit" variant="contained" sx={{ mt: 2, width: "100%" }} disabled={submitting}>
            {submitting ? (id ? "Updating..." : "Submitting...") : id ? "Update Request" : "Request Part"}
          </Button>
        </form>
      )}
    </Container>
  );
};

export default RequestPage;


