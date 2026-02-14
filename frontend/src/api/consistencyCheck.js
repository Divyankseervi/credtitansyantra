import govRecordsData from '../data/govRecords.json';

/**
 * Get government land use record by survey number and state
 */
export function getGovLandUse(surveyNumber, state) {
  const record = govRecordsData.records.find(
    (r) => r.surveyNumber === surveyNumber && r.state === state
  );
  return record ? record.landUse : null;
}

/**
 * Detect land use based on NDVI value
 */
export function detectLandUseFromNDVI(avgNDVI) {
  if (avgNDVI === null || avgNDVI === undefined) {
    return null;
  }

  const ndvi = parseFloat(avgNDVI);

  if (ndvi > 0.5) {
    return 'Agricultural';
  } else if (ndvi >= 0.2 && ndvi <= 0.5) {
    return 'Residential';
  } else if (ndvi < 0.2) {
    return 'Industrial';
  }

  return null;
}

/**
 * Check consistency between declared, government, and detected land use
 */
export function checkConsistency(declaredUse, govUse, detectedUse) {
  if (declaredUse === govUse && govUse === detectedUse) {
    return {
      status: 'MATCH',
      message: '✔ All sources align perfectly - Record is consistent.',
      confidenceLevel: 'High',
    };
  }

  if (declaredUse === govUse && declaredUse !== detectedUse) {
    return {
      status: 'PARTIAL_MISMATCH',
      message:
        '⚠ Ground reality mismatch - Documents align but satellite data differs.',
      confidenceLevel: 'Medium',
    };
  }

  if (declaredUse !== govUse && (govUse === detectedUse || declaredUse === detectedUse)) {
    return {
      status: 'PARTIAL_MISMATCH',
      message:
        '⚠ Document-record mismatch - One source conflicts with another.',
      confidenceLevel: 'Medium',
    };
  }

  return {
    status: 'STRONG_MISMATCH',
    message:
      '🚨 Strong inconsistency - All three sources show different land uses.',
    confidenceLevel: 'Low',
  };
}

/**
 * Generate simple hash for blockchain snapshot
 */
export async function generateConsistencyHash(surveyNumber, polygonCoordinates, result) {
  const data = `${surveyNumber}-${JSON.stringify(polygonCoordinates)}-${JSON.stringify(result)}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Create blockchain snapshot
 */
export async function createBlockchainSnapshot(surveyNumber, polygonCoordinates, result) {
  const hash = await generateConsistencyHash(surveyNumber, polygonCoordinates, result);
  return {
    timestamp: new Date().toISOString(),
    surveyNumber,
    polygonCoordinates,
    result,
    hash,
  };
}

/**
 * Main consistency check function
 */
export async function performConsistencyCheck(checkData) {
  const {
    surveyNumber,
    declaredUse,
    state,
    avgNDVI,
    polygonCoordinates = [],
  } = checkData;

  const govUse = getGovLandUse(surveyNumber, state);
  const detectedUse = detectLandUseFromNDVI(avgNDVI);
  const consistency = checkConsistency(declaredUse, govUse, detectedUse);
  const riskFlag = consistency.status !== 'MATCH';

  const result = {
    declaredUse,
    govUse: govUse || 'Not found in records',
    detectedUse: detectedUse || 'Unable to determine',
    consistencyStatus: consistency.status,
    consistencyMessage: consistency.message,
    confidenceLevel: consistency.confidenceLevel,
    riskFlag,
    timestamp: new Date().toISOString(),
  };

  const snapshot = await createBlockchainSnapshot(
    surveyNumber,
    polygonCoordinates,
    result
  );

  return {
    ...result,
    snapshot,
  };
}
