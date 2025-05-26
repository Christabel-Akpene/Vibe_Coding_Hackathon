import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { Camera as CameraIcon, Rotate3d as Rotate, Check, X, Upload } from 'lucide-react-native';
import { router } from 'expo-router';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    amount: number | null;
    date: string | null;
    vendor: string | null;
  }>({
    amount: null,
    date: null,
    vendor: null,
  });
  const { user } = useAuth();
  const cameraRef = useRef<any>(null);

  // Function to capture photo
  const capturePhoto = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      setIsCapturing(false);
      
      // In a real implementation, we would process the image with OCR
      processImageWithOCR(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      setIsCapturing(false);
    }
  };

  // Mock OCR processing
  const processImageWithOCR = (uri: string) => {
    setIsProcessing(true);
    
    // Simulate OCR processing delay
    setTimeout(() => {
      // Mock result - in a real app, we would use Tesseract.js
      setOcrResult({
        amount: Math.floor(Math.random() * 100) + 10,
        date: new Date().toISOString(),
        vendor: 'Sample Store',
      });
      
      setIsProcessing(false);
    }, 2000);
  };

  // Function to save transaction with receipt image
  const saveTransaction = () => {
    // In a real app, this would upload the image and save the transaction
    router.replace('/(tabs)');
  };

  // Reset camera state
  const resetCamera = () => {
    setPhotoUri(null);
    setOcrResult({
      amount: null,
      date: null,
      vendor: null,
    });
  };

  // Toggle between front and back camera
  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  // Request permission if needed
  if (!permission) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Photo Capture" />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Show permission request screen if not granted
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Photo Capture" />
        <View style={styles.centeredContainer}>
          <Text style={styles.permissionText}>
            We need your permission to use the camera
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If not web platform, show platform notice
  if (Platform.OS !== 'web' && Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Photo Capture" />
        <View style={styles.centeredContainer}>
          <Text style={styles.platformNotice}>
            Camera functionality is not available on this platform.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Photo Capture" />
      
      <View style={styles.contentContainer}>
        {!photoUri ? (
          <>
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={cameraType}
              >
                <View style={styles.cameraControls}>
                  <TouchableOpacity
                    style={styles.flipButton}
                    onPress={toggleCameraType}
                  >
                    <Rotate size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
            
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={capturePhoto}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <CameraIcon size={30} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={styles.instructionText}>
              Take a photo of your receipt to automatically extract the transaction details
            </Text>
          </>
        ) : (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: photoUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.processingText}>Analyzing receipt...</Text>
              </View>
            ) : (
              <>
                <View style={styles.resultContainer}>
                  <Text style={styles.resultTitle}>Receipt Details</Text>
                  
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Amount:</Text>
                    <Text style={styles.resultValue}>
                      {ocrResult.amount ? `$${ocrResult.amount.toFixed(2)}` : 'Not detected'}
                    </Text>
                  </View>
                  
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Date:</Text>
                    <Text style={styles.resultValue}>
                      {ocrResult.date ? new Date(ocrResult.date).toLocaleDateString() : 'Not detected'}
                    </Text>
                  </View>
                  
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Vendor:</Text>
                    <Text style={styles.resultValue}>
                      {ocrResult.vendor || 'Not detected'}
                    </Text>
                  </View>
                  
                  <Text style={styles.editHint}>
                    You can edit these details on the next screen
                  </Text>
                </View>
                
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={resetCamera}
                  >
                    <X size={24} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Retake</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={saveTransaction}
                  >
                    <Check size={24} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  contentContainer: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  instructionText: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  processingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Inter-Regular',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.card,
  },
  resultLabel: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Inter-Regular',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  editHint: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
    backgroundColor: Colors.light.secondary,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  platformNotice: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
});