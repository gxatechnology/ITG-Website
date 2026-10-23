<?php
declare(strict_types=1);
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {http_response_code(405); exit('Method not allowed');}
function text_field(string $key, int $limit=1200): string {
 $value = $_POST[$key] ?? '';
 if(!is_string($value)) return '';
 $value = trim(strip_tags($value));
 $value = preg_replace('/[\x00-\x1f\x7f]+/u',' ', $value) ?? '';
 return function_exists('mb_substr') ? mb_substr($value,0,$limit,'UTF-8') : substr($value,0,$limit);
}
if (text_field('website') !== '') {http_response_code(400);exit('Invalid request');}
if (text_field('consent') !== 'yes') {http_response_code(400);exit('Consent required');}
$type=text_field('form_type',30);
if(!in_array($type,['contact','quote','translator'],true)){http_response_code(400);exit('Unknown enquiry type');}
$name=text_field('full_name',150);$email=text_field('email',240);
if(strlen($name)<2 || !filter_var($email,FILTER_VALIDATE_EMAIL)){http_response_code(422);exit('Please enter a valid name and email.');}
if(!empty($_FILES)){http_response_code(400);exit('File attachments are not accepted by this public form.');}
$items=['form_type','full_name','email','phone','organization','service','source_language','target_language','word_count','deadline','native_language','language_pairs','specialisation','experience','message'];
$lines=[];foreach($items as $key){$val=text_field($key,2400);if($val!=='')$lines[]=strtoupper(str_replace('_',' ',$key)).': '.$val;}
$ref='ITG-'.gmdate('Ymd').'-'.strtoupper(bin2hex(random_bytes(3)));
$lines[]='REFERENCE: '.$ref;
$body=implode("\n",$lines);
$recipient='itg.translators@gmail.com';
$subject='ITG Website '.ucfirst($type).' Request ['.$ref.']';
// No arbitrary user input in mail headers. From sender uses hosting server identity.
$hostname=preg_replace('/[^a-z0-9.-]/i','',$_SERVER['SERVER_NAME'] ?? 'localhost');
$from='no-reply@'.$hostname;
$headers=['From: ITG Website <'.$from.'>','Reply-To: '.$email,'Content-Type: text/plain; charset=UTF-8'];
if(@mail($recipient,$subject,$body,implode("\r\n",$headers))){
  header('Location: ../quote-confirmation.html?sent=1&ref='.rawurlencode($ref),true,303);exit;
}
http_response_code(503);
header('Content-Type: text/html; charset=UTF-8');
echo '<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Message could not be sent</title><body style="font-family:Arial,sans-serif;max-width:650px;margin:12vh auto;padding:25px;line-height:1.7"><h1>Message could not be sent</h1><p>Your hosting mail service has not confirmed sending this request. Please email ITG directly at <a href="mailto:itg.translators@gmail.com">itg.translators@gmail.com</a> or <a href="https://wa.me/917620613859">contact via WhatsApp</a>.</p><a href="../contact.html">Return to the website</a></body></html>';
