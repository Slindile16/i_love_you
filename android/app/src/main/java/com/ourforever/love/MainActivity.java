package com.ourforever.love;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;

public final class MainActivity extends ComponentActivity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(255, 240, 243));
        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);

        // Keep content above system bars, cutouts, and the on-screen keyboard.
        ViewCompat.setOnApplyWindowInsetsListener(root, (view, windowInsets) -> {
            Insets bars = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars()
                    | WindowInsetsCompat.Type.displayCutout() | WindowInsetsCompat.Type.ime());
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
        ViewCompat.requestApplyInsets(root);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        webView.setBackgroundColor(Color.rgb(255, 240, 243));
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);

        WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                WebResourceResponse local = assets.shouldInterceptRequest(request.getUrl());
                if (local != null) return local;
                // Everything is bundled; never fetch remote resources.
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not found",
                        null, new ByteArrayInputStream(new byte[0]));
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return true;
            }
        });

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                webView.evaluateJavascript(
                        "Boolean(window.handleAndroidBack && window.handleAndroidBack())",
                        handled -> {
                            if (!"true".equals(handled)) finish();
                        });
            }
        });
        // Each launch returns to the gate; checklist and meter live in local storage.
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    @Override protected void onPause() {
        webView.onPause();
        super.onPause();
    }

    @Override protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override protected void onDestroy() {
        ((FrameLayout) webView.getParent()).removeView(webView);
        webView.destroy();
        super.onDestroy();
    }
}
