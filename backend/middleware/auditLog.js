const AuditLog = require('../models/AuditLog');

const auditLog = (action, entity) => {
  return async (req, res, next) => {
    const originalSend = res.json;
    
    res.json = function(data) {
      if (res.statusCode < 400) {
        // Log successful actions
        AuditLog.create({
          action,
          entity,
          entityId: req.params.id || req.body._id || null,
          userId: req.user?.id || null,
          changes: {
            before: req.originalBody || null,
            after: req.method === 'DELETE' ? null : req.body
          },
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent')
        }).catch(err => console.error('Audit log error:', err));
      }
      originalSend.call(this, data);
    };
    
    if (req.method === 'PUT' || req.method === 'PATCH') {
      req.originalBody = req.body;
    }
    
    next();
  };
};

module.exports = auditLog;
