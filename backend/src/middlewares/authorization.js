export const authorizedRenter = (req, res, next) => {
    if(req.role === "Tenant" || req.role ==='Both')
        next();
    else
    return res.status(403).json({
        message: "Not Authorized Renter"
    })
};

export const authorizedProvider = (req, res, next) => {
    if(req.role === "Provider" || req.role ==='Both')
        next();
    else
    return res.status(403).json({
        message: "Not Authorized Provider"
    })
};
