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
  Autocomplete,
} from "@mui/material";

const RequestPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [errors, setErrors] = useState({});
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [partSuggestions, setPartSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partLoading, setPartLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vendorRes, customerRes] = await Promise.all([
          fetch("http://localhost:8080/api/vendors"),
          fetch("http://localhost:8080/api/customers"),
        ]);

        if (!vendorRes.ok || !customerRes.ok) {
          setError("Failed to load vendors or customers.");
          return;
        }

        const vendorData = await vendorRes.json();
        const customerData = await customerRes.json();

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
          const reqRes = await fetch(`http://localhost:8080/api/requests/${id}`);
          if (reqRes.ok) {
            const reqData = await reqRes.json();
            setFormData({
              ...reqData,
              vendor: reqData.vendor?.id || "",
              customer: reqData.customer?.id || "",
              partId: reqData.partId || "",
            });
          } else {
            setError("Failed to load request details.");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchPartSuggestions = async (term) => {
    if (!term || term.length < 2) {
      setPartSuggestions([]);
      return;
    }

    setPartLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/inventory/search?query=${term}`
      );
      if (res.ok) {
        const data = await res.json();
        setPartSuggestions(data);
      } else {
        const errorText = await res.text();
        console.error("Error response from server:", res.status, errorText);
        setPartSuggestions([]);
      }
    } catch (err) {
      console.error("Part fetch error:", err);
      setPartSuggestions([]);
    } finally {
      setPartLoading(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "srNumber":
      case "fieldServiceTaskNumber":
      case "faultPartNumber":
        return !/^[a-zA-Z0-9]*$/.test(value);
      case "mailIds":
        if (value) {
          const emails = value.split(",").map((email) => email.trim());
          return !emails.every((email) =>
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
          );
        }
        return false;
      default:
        return !value;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartInputChange = (event, value) => {
    fetchPartSuggestions(value);
    setErrors((prev) => ({
      ...prev,
      partId: !value,
    }));
    setFormData((prev) => ({
      ...prev,
      partId: value,
    }));
  };

  const handlePartSelect = (event, value) => {
    const selected =
      typeof value === "string"
        ? value
        : value?.inBoxPartNumber || value?.boxPartNumber || "";
    setFormData((prev) => ({
      ...prev,
      partId: selected,
    }));
    setErrors((prev) => ({
      ...prev,
      partId: !selected,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      vendor: !formData.vendor,
      customer: !formData.customer,
      srNumber: validateField("srNumber", formData.srNumber),
      fieldServiceTaskNumber: validateField(
        "fieldServiceTaskNumber",
        formData.fieldServiceTaskNumber
      ),
      faultPartNumber: validateField("faultPartNumber", formData.faultPartNumber),
      mailIds: validateField("mailIds", formData.mailIds),
      description: !formData.description,
      partId: !formData.partId,
    };
    setErrors(newErrors);
    return Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setError("Please correct the errors in the form.");
      return;
    }

    const payload = {
      ...formData,
      vendor: { id: parseInt(formData.vendor, 10) },
      customer: { id: parseInt(formData.customer, 10) },
      requestedUserId: formData.requestedUserId
        ? parseInt(formData.requestedUserId, 10)
        : null,
      updatedAt: new Date().toISOString(),
    };

    if (!id) payload.createdAt = new Date().toISOString();

    try {
      const token = localStorage.getItem("token"); // ✅ get the token

      const response = await fetch(
        id
          ? `http://localhost:8080/api/requests/${id}`
          : "http://localhost:8080/api/requests",
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ attach token
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Request submitted successfully!");
        navigate(-1);
      } else {
        const errText = await response.text();
        console.error("Error:", errText);
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, p: 2, bgcolor: "#fff", borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#ECECEC",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">{id ? "Edit Request" : "Add New Request"}</Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Box sx={{ flex: 1 }}>
              {[
                ["name", "Name"],
                ["srNumber", "SR Number"],
                ["fieldServiceTaskNumber", "Field Service Task Number"],
                ["faultPartNumber", "Fault Part Number"],
                ["mailIds", "Email IDs (comma separated)"],
              ].map(([name, label]) => (
                <TextField
                  key={name}
                  fullWidth
                  name={name}
                  label={label}
                  value={formData[name]}
                  onChange={handleChange}
                  error={errors[name]}
                  helperText={
                    errors[name]
                      ? name === "mailIds"
                        ? "Invalid email format"
                        : "Invalid value"
                      : ""
                  }
                  size="small"
                  sx={{ mb: 1.5 }}
                />
              ))}

              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                helperText={errors.description ? "Required" : ""}
                size="small"
                sx={{ mb: 1.5 }}
              />

              <TextField
                select
                fullWidth
                label="Vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                error={errors.vendor}
                helperText={errors.vendor ? "Required" : ""}
                size="small"
                sx={{ mb: 1.5 }}
              >
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Customer"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                error={errors.customer}
                helperText={errors.customer ? "Required" : ""}
                size="small"
                sx={{ mb: 1.5 }}
              >
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

            <Box sx={{ flex: 0.6 }}>
              <Autocomplete
                freeSolo
                options={partSuggestions}
                getOptionLabel={(opt) =>
                  typeof opt === "string"
                    ? opt
                    : opt.inBoxPartNumber || opt.boxPartNumber || ""
                }
                inputValue={formData.partId}
                onInputChange={handlePartInputChange}
                onChange={handlePartSelect}
                loading={partLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Part Number"
                    error={errors.partId}
                    helperText={errors.partId ? "Required" : ""}
                    size="small"
                    sx={{ mb: 1.5 }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {partLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.inBoxPartNumber || option.boxPartNumber}
                  </li>
                )}
              />
            </Box>
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {id ? "Update Request" : "Submit Request"}
          </Button>
        </form>
      )}
    </Container>
  );
};

export default RequestPage;
