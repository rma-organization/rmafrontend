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

  const [errors, setErrors] = useState({
    name: false,
    vendor: false,
    customer: false,
    srNumber: false,
    fieldServiceTaskNumber: false,
    faultPartNumber: false,
    mailIds: false,
    description: false,
    partId: false,
  });

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
    const selectedPart =
      typeof value === "string"
        ? value
        : value?.inBoxPartNumber || value?.boxPartNumber || "";

    setErrors((prev) => ({
      ...prev,
      partId: !selectedPart,
    }));
    setFormData((prev) => ({
      ...prev,
      partId: selectedPart,
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

    return Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setError("Please correct the errors in the form before submitting.");
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

    if (!id) {
      payload.createdAt = new Date().toISOString();
    }

    try {
      const response = await fetch(
        id
          ? `http://localhost:8080/api/requests/${id}`
          : "http://localhost:8080/api/requests",
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Request submitted successfully!");
        navigate(-1);
      } else {
        const errData = await response.json();
        console.error("Error submitting request:", errData);
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error occurred. Try again.");
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 3, p: 2, bgcolor: "#FFFBFB", borderRadius: 2, boxShadow: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#ECE7E7",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">
          {id ? "Edit Request" : "Add New Request"}
        </Typography>
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          size="small"
          sx={{ bgcolor: "#2715E6", "&:hover": { bgcolor: "#1F10C8" } }}
        >
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
              {/* All Left-Side Text Fields */}
              {[
                ["name", "Name"],
                ["srNumber", "SR Number"],
                ["fieldServiceTaskNumber", "Field Service Task Number"],
                ["faultPartNumber", "Fault Part Number"],
                ["mailIds", "Email ID (comma separated for multiple)"],
              ].map(([name, label]) => (
                <TextField
                  key={name}
                  fullWidth
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  size="small"
                  required
                  error={errors[name]}
                  helperText={
                    errors[name]
                      ? name === "mailIds"
                        ? "Please enter valid email addresses"
                        : "Only alphanumeric characters allowed"
                      : ""
                  }
                  sx={{ mb: 1.5 }}
                />
              ))}

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                size="small"
                required
                error={errors.description}
                helperText={errors.description ? "Description is required" : ""}
                sx={{ mb: 1.5 }}
              />

              <TextField
                select
                fullWidth
                label="Vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                size="small"
                required
                error={errors.vendor}
                helperText={errors.vendor ? "Vendor is required" : ""}
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
                size="small"
                required
                error={errors.customer}
                helperText={errors.customer ? "Customer is required" : ""}
                sx={{ mb: 1.5 }}
              >
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Divider
              flexItem
              orientation="vertical"
              sx={{ mx: 1, backgroundColor: "#ccc" }}
            />

            <Box sx={{ flex: 0.5 }}>
              <Autocomplete
                freeSolo
                options={partSuggestions}
                getOptionLabel={(option) =>
                  typeof option === "string"
                    ? option
                    : option.inBoxPartNumber || option.boxPartNumber || option.name || ""
                }
                inputValue={formData.partId}
                onInputChange={handlePartInputChange}
                onChange={handlePartSelect}
                loading={partLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Part Number"
                    size="small"
                    variant="outlined"
                    required
                    error={errors.partId}
                    helperText={errors.partId ? "Part number is required" : ""}
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
                    {option.description && ` - ${option.description}`}
                  </li>
                )}
              />
            </Box>
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {id ? "Update Request" : "Request Part"}
          </Button>
        </form>
      )}
    </Container>
  );
};

export default RequestPage;
