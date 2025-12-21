export interface TwitterPostData {
  text: string
  image?: string
  tweetUrl?: string
}

export interface TwitterCredentials {
  apiKey: string
  apiSecret: string
  accessToken: string
  accessTokenSecret: string
}

export interface ValidationResult {
  valid: boolean
  error?: string
  userInfo?: {
    id: string
    username: string
    name: string
  }
}

export class TwitterService {
  static async postToTwitter(postData: TwitterPostData, userCredentials: any): Promise<{ success: boolean; tweetUrl?: string; error?: string }> {
    try {
     
      console.log('Posting to Twitter:', postData)
      
      // Mock Twitter API call
      const mockResponse = await this.mockTwitterAPI(postData, userCredentials)
      
      if (mockResponse.success) {
        return {
          success: true,
          tweetUrl: `https://twitter.com/user/status/${mockResponse.tweetId}`
        }
      } else {
        return {
          success: false,
          error: mockResponse.error
        }
      }
    } catch (error) {
      console.error('Twitter posting failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private static async mockTwitterAPI(postData: TwitterPostData, userCredentials: any): Promise<{ success: boolean; tweetId?: string; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock success response (90% success rate for demo)
    if (Math.random() > 0.1) {
      const tweetId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      return {
        success: true,
        tweetId
      }
    } else {
      return {
        success: false,
        error: 'Twitter API rate limit exceeded'
      }
    }
  }

  // Real Twitter API implementation would look something like this:
  static async postToTwitterReal(postData: TwitterPostData, userCredentials: any): Promise<{ success: boolean; tweetUrl?: string; error?: string }> {
    try {
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userCredentials.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: postData.text
        })
      })

      if (response.ok) {
        const tweetData = await response.json()
        return {
          success: true,
          tweetUrl: `https://twitter.com/user/status/${tweetData.data.id}`
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.detail || 'Twitter API error'
        }
      }
    } catch (error) {
      console.error('Twitter API error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Validate Twitter API credentials
   * This checks if the provided credentials are valid by making a test API call
   */
  static async validateCredentials(credentials: TwitterCredentials): Promise<ValidationResult> {
    try {
      const { apiKey, apiSecret, accessToken, accessTokenSecret } = credentials;

      // Basic validation - check if all fields are present and not empty
      if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
        return {
          valid: false,
          error: 'All credential fields are required'
        };
      }

      // Check if credentials have minimum length (basic format validation)
      if (apiKey.length < 10 || apiSecret.length < 10 || 
          accessToken.length < 10 || accessTokenSecret.length < 10) {
        return {
          valid: false,
          error: 'Credentials appear to be invalid (too short)'
        };
      }

      // For now, we'll use a mock validation
      // In production, you would make an actual API call to Twitter
      const validationResult = await this.mockValidateCredentials(credentials);
      
      return validationResult;

      // Real implementation would look like this:
      // return await this.validateCredentialsReal(credentials);
    } catch (error) {
      console.error('Credential validation error:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Validation failed'
      };
    }
  }

  /**
   * Mock credential validation for development
   * In production, replace this with real Twitter API validation
   */
  private static async mockValidateCredentials(credentials: TwitterCredentials): Promise<ValidationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation logic
    // Check if credentials contain "invalid" or "wrong" for testing
    const credString = JSON.stringify(credentials).toLowerCase();
    if (credString.includes('invalid') || credString.includes('wrong')) {
      return {
        valid: false,
        error: 'Invalid API credentials. Please check your Twitter Developer Portal.'
      };
    }

    // Check if credentials are too short (basic validation)
    if (credentials.apiKey.length < 20 || credentials.apiSecret.length < 40) {
      return {
        valid: false,
        error: 'API Key or Secret appears to be invalid'
      };
    }

    if (credentials.accessToken.length < 40 || credentials.accessTokenSecret.length < 40) {
      return {
        valid: false,
        error: 'Access Token or Secret appears to be invalid'
      };
    }

    // Mock successful validation
    return {
      valid: true,
      userInfo: {
        id: '1234567890',
        username: 'demo_user',
        name: 'Demo User'
      }
    };
  }

  /**
   * Real Twitter API credential validation
   * This makes an actual API call to verify credentials
   */
  static async validateCredentialsReal(credentials: TwitterCredentials): Promise<ValidationResult> {
    try {
      // Use Twitter API v2 to verify credentials
      // We'll make a simple request to get the authenticated user's info
      const response = await fetch('https://api.twitter.com/2/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          valid: true,
          userInfo: {
            id: data.data.id,
            username: data.data.username,
            name: data.data.name
          }
        };
      } else {
        const errorData = await response.json();
        let errorMessage = 'Invalid credentials';

        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please check your API credentials.';
        } else if (response.status === 403) {
          errorMessage = 'Access forbidden. Please check your API permissions.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].message;
        }

        return {
          valid: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Twitter API validation error:', error);
      return {
        valid: false,
        error: 'Failed to connect to Twitter API. Please check your internet connection.'
      };
    }
  }
}
