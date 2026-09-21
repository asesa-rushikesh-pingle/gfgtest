import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Platform,
  Keyboard,
  Alert,
  Linking,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import TitleBar from './components/TitleBar';
import styles from './Style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pick, types } from '@react-native-documents/picker';
import { getData, postFormData } from '../helper/callApi';

function mapAttachment(attachment) {
  if (!attachment) {
    return null;
  }
  if (typeof attachment === 'string') {
    return { uri: attachment, name: 'Attachment', type: '' };
  }
  const uri = attachment.file_url || attachment.uri || '';
  const name =
    attachment.file_name || attachment.name || 'Attachment';
  const type =
    attachment.mime_type || attachment.type || '';
  if (!uri && !name) {
    return null;
  }
  return {
    uri,
    name,
    type,
    size: attachment.file_size || attachment.size || '',
  };
}

function isImageFile(file) {
  if (!file) {
    return false;
  }
  const type = String(file.type || file.mime_type || '').toLowerCase();
  const name = String(file.name || file.file_name || file.uri || '').toLowerCase();
  return type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|heic)$/.test(name);
}

function mapChatMessage(msg) {
  return {
    id: msg?.id,
    isOwn: msg?.is_own == 1 || msg?.isOwn === true,
    userName: msg?.sender_name || msg?.userName || 'User',
    text: msg?.message || msg?.text || '',
    datetime: msg?.created_at || msg?.datetime || '',
    file: mapAttachment(msg?.attachment),
  };
}

function FilePreview({ file, large = false }) {
  if (!file) {
    return null;
  }

  if (isImageFile(file) && file.uri) {
    return (
      <Image
        source={{ uri: file.uri }}
        style={large ? stylesNew.previewImageLarge : stylesNew.previewImage}
      />
    );
  }

  return (
    <View style={stylesNew.fileBox}>
      <Image
        source={require('../assets/images/drive_folder_upload.png')}
        style={{ width: 24, height: 24 }}
      />
      <Text style={stylesNew.fileName} numberOfLines={2}>
        {file.name || 'Document'}
      </Text>
      {!!file.size && (
        <Text style={[stylesNew.fileName, { marginTop: 2, fontSize: 10 }]}>
          {file.size}
        </Text>
      )}
    </View>
  );
}

export default function QueryChat({ route }) {
  const query = route?.params?.query || {};
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const [infoVisible, setInfoVisible] = useState(false);
  const [ownName, setOwnName] = useState('You');
  const [messages, setMessages] = useState([]);
  const [queryDetails, setQueryDetails] = useState(null);
  const [inputText, setInputText] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inset = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const messagesControllerRef = useRef(null);

  useEffect(() => {
    async function initChat() {
      const first = await AsyncStorage.getItem('first_name');
      const last = await AsyncStorage.getItem('last_name');
      const name = `${first || ''} ${last || ''}`.trim() || 'You';
      setOwnName(name);
      getMessagesFn();
    }
    initChat();
    return () => {
      messagesControllerRef.current?.abort();
    };
  }, []);

  async function getMessagesFn() {
    if (!query?.id) {
      setMessages([]);
      return;
    }

    messagesControllerRef.current?.abort();
    const controller = new AbortController();
    messagesControllerRef.current = controller;

    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await getData(
      branch,
      '/admin/communication/get',
      { query_id: query.id },
      controller,
    );

    if (respo?.status) {
      const queryData = respo?.data?.query || {};
      const users = (queryData?.users || [])
        .map(user => user?.full_name)
        .filter(Boolean)
        .join(', ');
      setQueryDetails({
        subject: queryData?.subject || query?.subject || '',
        query_text: queryData?.description || query?.query_text || '',
        coach_name: users || query?.coach_name || '—',
        created_at: queryData?.date || query?.created_at || '',
        file: mapAttachment(queryData?.attachment) || query?.file || null,
      });
      setMessages((queryData?.messages || []).map(mapChatMessage));
    }
  }

  async function openAttachment(file) {
    if (!file?.uri) {
      return;
    }
    if (isImageFile(file)) {
      setPreviewFile(file);
      return;
    }
    try {
      const canOpen = await Linking.canOpenURL(file.uri);
      if (canOpen) {
        await Linking.openURL(file.uri);
      } else {
        Alert.alert('Unable to open file');
      }
    } catch (e) {
      Alert.alert('Unable to open file');
    }
  }

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [messages, keyboardHeight]);

  const pickFile = async () => {
    try {
      const result = await pick({
        allowMultiSelection: false,
        mode: 'open',
        type: [types.images, types.pdf],
      });

      if (result && result.length > 0) {
        setPendingFile(result[0]);
      }
    } catch (e) {
      if (e.code === 'DOCUMENT_PICKER_CANCELED') {
        return;
      }
      console.log('Error:', e);
    }
  };

  async function sendMessage() {
    const text = inputText.trim();
    if ((!text && !pendingFile) || isLoading) {
      return;
    }
    if (!query?.id) {
      Alert.alert('Query not found');
      return;
    }

    Keyboard.dismiss();
    const branch = await AsyncStorage.getItem('branch_slug');
    const formData = new FormData();
    formData.append('message', text);
    formData.append('query_id', query.id);
    if (pendingFile) {
      formData.append('attachment', {
        uri: pendingFile.uri,
        name: pendingFile.name || 'attachment',
        type: pendingFile.type || 'application/octet-stream',
      });
    }

    const respo = await postFormData(
      branch,
      '/admin/communication/send-message',
      formData,
      setIsLoading,
    );

    if (respo?.status) {
      const sent = respo?.data?.message;
      setMessages(prev => [
        ...prev,
        mapChatMessage(
          sent || {
            id: Date.now(),
            is_own: 1,
            sender_name: ownName,
            message: text,
            created_at: '',
            attachment: pendingFile
              ? {
                  uri: pendingFile.uri,
                  name: pendingFile.name,
                  type: pendingFile.type,
                }
              : null,
          },
        ),
      ]);
      setInputText('');
      setPendingFile(null);
    }
  }

  const title =
    query?.subject?.length > 22
      ? `${query.subject.slice(0, 22)}...`
      : query?.subject || 'Query';

  return (
    <View style={styles.parentWrapper}>
      <TitleBar
        title={title}
        setSafeAreaHeight={setSafeAreaHeight}
        onRightPress={() => setInfoVisible(true)}
      />

      <View style={{ flex: 1, paddingTop: safeAreaHeight }}>
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {messages.map(msg => {
            return (
              <View
                key={msg.id}
                style={{
                  alignItems: msg.isOwn ? 'flex-end' : 'flex-start',
                  marginTop: 16,
                }}
              >
                <Text style={stylesNew.metaText}>
                  {msg.userName}  •  {msg.datetime}
                </Text>
                <View
                  style={[
                    stylesNew.bubble,
                    msg.isOwn ? stylesNew.ownBubble : stylesNew.otherBubble,
                    msg.file && isImageFile(msg.file) ? { minWidth: 100 } : null,
                  ]}
                >
                  {!!msg.text && (
                    <Text
                      style={[
                        stylesNew.bubbleText,
                        { color: msg.isOwn ? '#121212' : '#fff' },
                      ]}
                    >
                      {msg.text}
                    </Text>
                  )}
                  {!!msg.file && (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => {
                        Keyboard.dismiss();
                        openAttachment(msg.file);
                      }}
                      style={{ marginTop: msg.text ? 8 : 0 }}
                    >
                      <FilePreview file={msg.file} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 8 : inset.bottom + 10,
          }}
        >
          {pendingFile && (
            <View style={stylesNew.pendingFile}>
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={0.85}
                onPress={() => setPreviewFile(pendingFile)}
              >
                <FilePreview file={pendingFile} />
                <Text style={stylesNew.pendingName} numberOfLines={1}>
                  {pendingFile.name || 'File selected'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPendingFile(null)}>
                <Image
                  source={require('../assets/images/cll.png')}
                  style={{ width: 24, height: undefined, aspectRatio: 1 }}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={stylesNew.composer}>
            <TouchableOpacity onPress={pickFile} style={stylesNew.iconBtn}>
              <Image
                source={require('../assets/images/drive_folder_upload.png')}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <TextInput
              style={stylesNew.chatInput}
              placeholder="Type a message"
              placeholderTextColor={'#656565'}
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
            />
            <TouchableOpacity
              onPress={() => {
                if (!isLoading) {
                  sendMessage();
                }
              }}
              style={stylesNew.sendBtn}
            >
              <Text style={stylesNew.sendBtnText}>
                {isLoading ? '...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        transparent
        visible={!!previewFile}
        animationType="fade"
        onRequestClose={() => setPreviewFile(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <View style={{ paddingTop: inset.top }}>
            <View style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 22,
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                File Preview
              </Text>
              <TouchableOpacity
                onPress={() => setPreviewFile(null)}
                style={{ position: 'absolute', top: '50%', right: 16 }}
              >
                <Image
                  style={{ height: undefined, width: 32, aspectRatio: 1 }}
                  source={require('../assets/images/cll.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={stylesNew.previewWrap}>
            {previewFile && isImageFile(previewFile) && previewFile.uri ? (
              <Image
                source={{ uri: previewFile.uri }}
                style={stylesNew.fullPreviewImage}
                resizeMode="contain"
              />
            ) : (
              <View style={stylesNew.previewFileCard}>
                <Image
                  source={require('../assets/images/drive_folder_upload.png')}
                  style={{ width: 48, height: 48, tintColor: '#EB6925' }}
                />
                <Text style={stylesNew.previewFileTitle}>
                  {previewFile?.name || 'Document'}
                </Text>
                {!!previewFile?.size && (
                  <Text style={stylesNew.previewFileHint}>{previewFile.size}</Text>
                )}
                {!!previewFile?.uri && (
                  <TouchableOpacity
                    onPress={() => openAttachment(previewFile)}
                    style={{ marginTop: 16 }}
                  >
                    <Text style={stylesNew.sendBtnText}>Open File</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={infoVisible}
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <View style={{ paddingTop: inset.top }}>
            <View style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 22,
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Query Info
              </Text>
              <TouchableOpacity
                onPress={() => setInfoVisible(false)}
                style={{ position: 'absolute', top: '50%', right: 16 }}
              >
                <Image
                  style={{ height: undefined, width: 32, aspectRatio: 1 }}
                  source={require('../assets/images/cll.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
            <View style={stylesNew.infoCard}>
              <Text style={stylesNew.infoLabel}>Subject</Text>
              <Text style={stylesNew.infoValue}>
                {queryDetails?.subject || query?.subject || '—'}
              </Text>
            </View>
            <View style={stylesNew.infoCard}>
              <Text style={stylesNew.infoLabel}>Query</Text>
              <Text style={stylesNew.infoValue}>
                {queryDetails?.query_text || query?.query_text || '—'}
              </Text>
            </View>
            <View style={stylesNew.infoCard}>
              <Text style={stylesNew.infoLabel}>Coach</Text>
              <Text style={stylesNew.infoValue}>
                {queryDetails?.coach_name || query?.coach_name || '—'}
              </Text>
            </View>
            <View style={stylesNew.infoCard}>
              <Text style={stylesNew.infoLabel}>Date</Text>
              <Text style={stylesNew.infoValue}>
                {queryDetails?.created_at || query?.created_at || '—'}
              </Text>
            </View>
            {(queryDetails?.file || query?.file) ? (
              <View style={stylesNew.infoCard}>
                <Text style={stylesNew.infoLabel}>Attachment</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setInfoVisible(false);
                    openAttachment(queryDetails?.file || query.file);
                  }}
                  style={{ marginTop: 10 }}
                >
                  <FilePreview
                    file={queryDetails?.file || query.file}
                    large={true}
                  />
                  {!!(queryDetails?.file || query.file)?.name && (
                    <Text style={[stylesNew.fileName, { marginTop: 8 }]}>
                      {(queryDetails?.file || query.file).name}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={stylesNew.infoCard}>
                <Text style={stylesNew.infoLabel}>Attachment</Text>
                <Text style={stylesNew.infoValue}>No file uploaded</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const stylesNew = StyleSheet.create({
  metaText: {
    color: '#A8A8A8',
    fontSize: 10,
    fontWeight: '400',
    marginBottom: 6,
  },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 12,
  },
  ownBubble: {
    backgroundColor: '#EB6925',
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: '#202020',
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  previewImage: {
    width: 140,
    minWidth: 100,
    height: 140,
    borderRadius: 8,
  },
  previewImageLarge: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    backgroundColor: '#2B2B2B',
    borderRadius: 8,
    padding: 10,
  },
  fileName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    flexShrink: 1,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#202020',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    columnGap: 6,
  },
  chatInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    maxHeight: 100,
    paddingVertical: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    backgroundColor: '#EB6925',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#121212',
    fontSize: 14,
    fontWeight: '700',
  },
  pendingFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    columnGap: 10,
  },
  pendingName: {
    color: '#A8A8A8',
    fontSize: 12,
    marginTop: 6,
  },
  infoCard: {
    backgroundColor: '#202020',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    color: '#A8A8A8',
    fontSize: 12,
    fontWeight: '400',
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 22,
  },
  previewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  fullPreviewImage: {
    width: '100%',
    height: '100%',
  },
  previewFileCard: {
    width: '100%',
    backgroundColor: '#202020',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  previewFileTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  previewFileHint: {
    color: '#A8A8A8',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 8,
    textAlign: 'center',
  },
});
